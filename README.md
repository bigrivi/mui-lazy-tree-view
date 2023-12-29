
# Implement lazy loading of data for mui tree view

Encapsulation of [@mui/x-tree-view](https://github.com/bigrivi/mui-x/tree/next/packages/x-tree-view) package

1. Support loading data on demand
2. Tree nodes support array data source
3. Support custom content components
4. Support custom title render
5. Compatible with all props of @mui/x-tree-view

## Installation & Usage

```
npm i mui-lazy-tree-view
```

This component has the following peer dependencies that you will need to install as well.

```json
"peerDependencies": {
  "@mui/x-tree-view": "^6.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
},
```

```tsx
import { useState } from "react";
import { makeStyles } from "tss-react/mui";
import "./App.css";
import { TreeView, TreeNode } from "mui-lazy-tree-view";

const useStyles = makeStyles()((theme) => {
    return {
        treeItemContent: {
            padding: "5px 8px !important",
        },
    };
});

const initTreeData: TreeNode[] = [
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
        setExpanded(nodeIds);
    };

    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
        setSelected(nodeId as string);
    };

    const onLazyLoad = ({ key, children }) => {
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

```
The children of any node are explicitly empty arrays.
such as children: [],will trigger the lazy loading callback function

**lazyLoadFn** Prop

Gets or sets a function that loads child nodes on demand.

The lazyLoadFn takes two parameters: the node being expanded and a callback to be invoked when the data becomes available.

The callback function return a Promise<TreeNode[]> tells the TreeView that the node loading process has been completed. It should always be called, even if there are errors when loading the data.

```tsx
const onLazyLoad = ({ key, children }) => {
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
```