import { useState } from "react";
import { makeStyles } from "tss-react/mui";
import "./App.css";
import { TreeView, TreeNode } from "mui-lazy-tree-view";

const useStyles = makeStyles()((theme) => {
    return {
        root: {
            padding: 0,
        },
        treeItemContent: {
            padding: "5px 8px",
        },
    };
});

const initTreeData = [
    {
        title: "node1",
        key: "node1",
        children: [
            {
                title: "node1_1",
                key: "node1_1",
            },
        ],
    },
    {
        title: "node2",
        key: "node2",
    },
    {
        title: "node3",
        key: "node3",
        children: [
            {
                title: "node3_1",
                key: "node3_1",
            },
            {
                title: "lazy node3_2",
                key: "lazy_node3_2",
                children: [],
            },
        ],
    },
];

function App() {
    const [treeData, setTreeData] = useState<TreeNode[]>(initTreeData);
    const [expanded, setExpanded] = useState(["node1"]);
    const [selected, setSelected] = useState<string>("");
    const { classes } = useStyles();

    const handleToggle = (event: any, nodeIds: string[]) => {
        console.log("handleToggle", nodeIds);
        setExpanded(nodeIds);
    };

    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
        console.log("handleSelect");
        setSelected(nodeId as string);
        // console.log("selected nodeId", nodeId);
    };

    const onLazyLoad = ({ key, children }) => {
        // key = "node2";
        return new Promise<TreeNode[]>((resolve) => {
            if (children && children.length) {
                resolve([]);
                return;
            }
            setTimeout(() => {
                resolve([
                    {
                        title: `Another lazy node...`,
                        key: `${key}-0`,
                        children: [],
                    },
                    {
                        title: "A non-lazy node without children",
                        key: `${key}-1`,
                    },
                    {
                        title: "A non-lazy node with child nodes",
                        key: `${key}-2`,
                        children: [
                            {
                                title: "nodeA",
                                key: `${key}-2-1`,
                            },
                            {
                                title: "nodeB",
                                key: `${key}-2-2`,
                            },
                        ],
                    },
                ]);
            }, 1000);
        });
    };

    return (
        <div className="App">
            <TreeView<false>
                expanded={expanded}
                onNodeToggle={handleToggle}
                treeData={treeData}
                treeItemClasses={{
                    content: classes.treeItemContent,
                }}
                selected={selected}
                sx={{ position: "relative" }}
                onNodeSelect={handleSelect}
                titleRender={(node) => {
                    return <>{node.title}</>;
                }}
                lazyLoadFn={onLazyLoad}
            />
        </div>
    );
}

export default App;
