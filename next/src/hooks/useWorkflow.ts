import { useMutation, useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type { Session } from "next-auth";
import { useState } from "react";
import type { Edge, Node } from "reactflow";
import { z } from "zod";

import useSocket from "./useSocket";
import WorkflowApi from "../services/workflow/workflowApi";
import { useWorkflowStore } from "../stores/workflowStore";
import type { NodeBlock, Workflow, WorkflowEdge, WorkflowNode } from "../types/workflow";
import { getNodeType, toReactFlowEdge, toReactFlowNode } from "../types/workflow";

const StatusEventSchema = z.object({
  nodeId: z.string(),
  status: z.enum(["running", "success", "error"]),
  remaining: z.number().optional(),
});

const SaveEventSchema = z.object({
  user_id: z.string(),
});

const updateNodeValue = <
  DATA extends WorkflowNode,
  KEY extends keyof DATA,
  T extends DATA extends WorkflowEdge ? Edge<DATA> : Node<DATA>
>(
  setNodes: (nodes: Node<WorkflowNode>[]) => void,
  key: KEY,
  value: DATA[KEY],
  filter: (node?: T["data"]) => boolean = () => true
) => {
  const currentNodes = useWorkflowStore.getState().workflow?.nodes ?? [];

  const updatedNodes = currentNodes.map((t: Node<WorkflowNode>) => {
    if (filter(t.data)) {
      return {
        ...t,
        data: {
          ...t.data,
          [key]: value,
        },
      };
    }
    return t;
  });

  setNodes(updatedNodes);
};

const updateEdgeValue = <
  DATA extends WorkflowEdge | WorkflowNode,
  KEY extends keyof DATA,
  T extends DATA extends WorkflowEdge ? Edge<DATA> : Node<DATA>
>(
  setEdges: (edges: Edge<WorkflowEdge>[]) => void,
  key: KEY,
  value: DATA[KEY],
  filter: (edge?: T["data"]) => boolean = () => true
) => {
  const currentEdges = useWorkflowStore.getState().workflow?.edges ?? [];

  const updatedEdges = currentEdges.map((t: Edge<WorkflowEdge>) => {
    if (filter(t.data)) {
      return {
        ...t,
        data: {
          ...t.data,
          [key]: value,
        },
      };
    }
    return t;
  }) as Edge<WorkflowEdge>[];

  setEdges(updatedEdges);
};

export const useWorkflow = (
  workflowId: string | undefined,
  session: Session | null,
  organizationId: string | undefined,
  onLog?: (log: LogType) => void
) => {
  const api = new WorkflowApi(session?.accessToken, organizationId);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNode> | undefined>(undefined);

  const { mutateAsync: updateWorkflow } = useMutation(async (data: Workflow) => {
    if (!workflowId) return;
    await api.update(workflowId, data);
  });

  const {
    nodeRefDictionary,
    addToNodeRefDictionary,
    workflow,
    setInputs,
    setWorkflow,
    setNodes,
    setEdges,
  } = useWorkflowStore();

  const { refetch: refetchWorkflow, isLoading } = useQuery(
    ["workflow", workflowId],
    async () => {
      if (!workflowId) {
        setNodes([]);
        setEdges([]);
        return;
      }

      const workflow = await api.get(workflowId);
      // @ts-ignore
      setWorkflow(workflow);
      console.log(workflow);
      setNodes(workflow?.nodes.map(toReactFlowNode) ?? []);
      setEdges(workflow?.edges.map(toReactFlowEdge) ?? []);
      return workflow;
    },
    {
      enabled: !!workflowId && !!session?.accessToken,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  // TODO: Fix this
  // useEffect(() => {
  //   const selectedNodes = workflow?.nodes.filter((n) => n.selected);
  //   if (selectedNodes && selectedNodes.length == 0) setSelectedNode(undefined);
  //   else setSelectedNode(selectedNodes[0]);
  // }, [workflow?.nodes]);

  const members = useSocket(
    workflowId,
    session?.accessToken,
    [
      {
        event: "workflow:node:status",
        callback: async (data) => {
          const { nodeId, status, remaining } = await StatusEventSchema.parseAsync(data);

          updateNodeValue(setNodes, "status", status, (n) => n?.id === nodeId);
          updateEdgeValue(setEdges, "status", status, (e) => e?.id === nodeId);

          if (status === "error" || remaining === 0) {
            setTimeout(() => {
              updateNodeValue(setNodes, "status", undefined);
              updateEdgeValue(setEdges, "status", undefined);
            }, 1000);
          }
        },
      },
      {
        event: "workflow:updated",
        callback: async (data) => {
          const { user_id } = await SaveEventSchema.parseAsync(data);
          if (user_id !== session?.user?.id) await refetchWorkflow();
        },
      },
      {
        event: "workflow:log",
        callback: async (data) => {
          const log = await LogSchema.parseAsync(data);
          onLog?.({ ...log, date: log.date.substring(11, 19) });
        },
      },
    ],
    {
      enabled: !!workflowId && !!session?.accessToken,
    }
  );

  const createNode: createNodeType = (block: NodeBlock, position: Position) => {
    const ref = nanoid(11);
    const node = {
      id: ref,
      type: getNodeType(block),
      position,
      data: {
        id: undefined,
        ref: ref,
        pos_x: 0,
        pos_y: 0,
        block: block,
      },
    };

    const newNodes = [...(useWorkflowStore.getState().workflow?.nodes ?? []), node];
    setNodes(newNodes);

    return node;
  };

  const updateNode: updateNodeType = (nodeToUpdate: Node<WorkflowNode>) => {
    const updatedNodes = (useWorkflowStore.getState().workflow?.nodes ?? []).map((node) => {
      if (node.id === nodeToUpdate.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...nodeToUpdate.data,
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const onSave = async () => {
    if (!workflowId) return;

    const nodes = useWorkflowStore.getState().workflow?.nodes ?? [];
    const edges = useWorkflowStore.getState().workflow?.edges ?? [];

    await updateWorkflow({
      id: workflowId,
      nodes: nodes.map((n) => ({
        id: n.data.id,
        ref: n.data.ref,
        pos_x: n.position.x,
        pos_y: n.position.y,
        block: n.data.block,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        source_handle: e.sourceHandle || undefined,
        target: e.target,
      })),
    });
  };

  const onExecute = async () => {
    if (!workflowId) return;
    await api.execute(workflowId);
  };

  const nodesModel = useWorkflowStore.getState().workflow?.nodes || [];
  const edgesModel = useWorkflowStore.getState().workflow?.nodes || [];
  return {
    nodesModel,
    edgesModel,
    selectedNode,
    saveWorkflow: onSave,
    executeWorkflow: onExecute,
    createNode,
    updateNode,
    members,
    isLoading,
  };
};

const LogSchema = z.object({
  // level: z.enum(["info", "error"]),
  date: z.string().refine((date) => date.substring(0, 19)), // Get rid of milliseconds
  msg: z.string(),
});

export type LogType = z.infer<typeof LogSchema>;
export type Position = { x: number; y: number };
export type createNodeType = (block: NodeBlock, position: Position) => Node<WorkflowNode>;
export type updateNodeType = (node: Node<WorkflowNode>) => void;
