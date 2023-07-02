import { type NextPage } from "next";
import FlowChart from "../../components/workflow/Flowchart";
import { useWorkflow } from "../../hooks/useWorkflow";

import { useRouter } from "next/router";
import SidebarLayout from "../../layout/sidebar";
import Button from "../../ui/button";

const WorkflowPage: NextPage = () => {
  const router = useRouter();

  const { nodesModel, edgesModel, saveWorkflow, createNode } = useWorkflow(
    router.query.workflow as string
  );

  return (
    <SidebarLayout>
      <FlowChart
        controls={true}
        isLoading={false}
        nodesModel={nodesModel}
        edgesModel={edgesModel}
        className="min-h-screen flex-1"
      />
      <div>
        <div className="absolute bottom-4 right-4 flex flex-row items-center justify-center gap-2">
          <Button
            className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-purple-700"
            onClick={() => {
              createNode();
            }}
          >
            New
          </Button>
          <Button
            className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-purple-700"
            onClick={async () => {
              await saveWorkflow();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default WorkflowPage;
