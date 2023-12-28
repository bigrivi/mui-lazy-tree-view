import React, { useEffect, useRef, useState } from "react";

import {
    TreeItem as MuiTreeItem,
    TreeItemContentProps,
    TreeItemProps as MuiTreeItemProps,
} from "@mui/x-tree-view/TreeItem";
import CustomContent from "./CustomContent";
import TreeItemLabel from "./Label";
import { TreeNode } from "./types";
import equal from "fast-deep-equal";

interface TreeItemsProps extends Omit<MuiTreeItemProps, "nodeId"> {
    node: TreeNode;
    treeItemClasses;
    titleRender?: (node: TreeNode) => React.ReactNode;
    lazyLoadFn?: (args: {
        key: string;
        children: TreeNode[];
    }) => Promise<any[]>;
    renderChildren: (
        parentNode: TreeNode,
        children: TreeNode[]
    ) => React.ReactNode;
    onExpand: (nodeKey: string) => void;
    ContentComponent?: React.JSXElementConstructor<TreeItemContentProps>;
    collapseIcon?: React.ReactNode;
    expandIcon?: React.ReactNode;
}

const TreeItem = ({
    node,
    titleRender,
    lazyLoadFn,
    renderChildren,
    onExpand,
    treeItemClasses,
    ContentComponent,
    collapseIcon,
    expandIcon,
    ...rest
}: TreeItemsProps) => {
    const [children, setChildren] = useState(node.children);
    const hasChildren = !!(children && children.length);
    const hasLazyLoad = typeof children != "undefined" && children.length == 0;
    const isMountRef = useRef(false);
    const [loading, setLoading] = useState(false);

    const handleLazyLoad = async () => {
        setLoading(true);
        const nodes = await lazyLoadFn({
            key: node.key,
            children: node.children,
        });
        node.children = nodes;
        setChildren(nodes);
        onExpand(node.key);
        setLoading(false);
    };

    const handleClick = async (event: React.MouseEvent) => {
        if (hasLazyLoad) {
            await handleLazyLoad();
        }
    };

    useEffect(() => {
        if (isMountRef.current) {
            if (node.children != children) {
                if (!equal(node.children, children)) {
                    setChildren(node.children);
                }
            }
        }
    }, [node.children]);

    useEffect(() => {
        isMountRef.current = true;
        return () => {
            isMountRef.current = false;
        };
    }, []);
    return (
        <MuiTreeItem
            ContentComponent={ContentComponent ?? CustomContent}
            key={node.key}
            nodeId={node.key}
            disabled={node.disabled}
            {...rest}
            classes={treeItemClasses}
            onClick={handleClick}
            label={
                <TreeItemLabel
                    loading={loading}
                    titleRender={titleRender}
                    onLazyLoad={handleLazyLoad}
                    collapseIcon={collapseIcon}
                    expandIcon={expandIcon}
                    node={node}
                />
            }
        >
            {renderChildren(node, children)}
        </MuiTreeItem>
    );
};

export default TreeItem;
