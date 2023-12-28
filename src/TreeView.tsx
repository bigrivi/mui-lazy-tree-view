import React, { FC, MouseEvent, useEffect, useRef, useState } from "react";
import {
  TreeView as MuiTreeView,
  TreeViewProps as MuiTreeViewProps,
} from "@mui/x-tree-view/TreeView";
import equal from "fast-deep-equal";
import {
  TreeItemClasses,
  TreeItemContentProps,
  TreeItem as MuiTreeItem,
} from "@mui/x-tree-view/TreeItem";
import TreeItem from "./TreeItem";
import { TreeNode } from "./types";

const LAZY_LOAD__PLACEHOLDER = "_lazy_load_placeholder";

interface ITreeViewProps<Multiple extends boolean | undefined>
  extends MuiTreeViewProps<Multiple> {
  treeData: TreeNode[];
  titleRender?: (node: TreeNode) => React.ReactNode;
  lazyLoadFn?: (args: {
    key: string;
    children: TreeNode[];
  }) => Promise<TreeNode[]>;
  treeItemClasses?: Partial<TreeItemClasses>;
  ContentComponent?: React.JSXElementConstructor<TreeItemContentProps>;
}

const TreeView = <Multiple extends boolean | undefined = undefined>({
  treeData,
  lazyLoadFn,
  treeItemClasses,
  titleRender,
  ContentComponent,
  expanded: expandedProp,
  onNodeToggle: onNodeToggleProp,
  defaultCollapseIcon,
  defaultExpandIcon,
  ...treeProps
}: ITreeViewProps<Multiple>) => {
  const [expanded, setExpanded] = useState(
    expandedProp ? [...expandedProp] : []
  );

  useEffect(() => {
    if (expandedProp) {
      if (!equal(expandedProp, expanded)) {
        setExpanded(expandedProp);
      }
    }
  }, [expandedProp]);

  const handleToggle = (event, nodeIds: string[]) => {
    setExpanded(nodeIds);
    onNodeToggleProp && onNodeToggleProp(null, nodeIds);
  };

  const handleExpand = (key: string) => {
    const newExpanded = [...expanded, key];
    setExpanded(newExpanded);
    onNodeToggleProp && onNodeToggleProp(null, newExpanded);
  };

  const renderChildren = (parent: TreeNode, children: TreeNode[]) => {
    const hasLazyLoad = typeof children != "undefined" && children.length == 0;

    if (hasLazyLoad && parent) {
      return (
        <MuiTreeItem nodeId={parent.key + LAZY_LOAD__PLACEHOLDER}></MuiTreeItem>
      );
    }
    if (!children) {
      return null;
    }

    return children.map((node) => {
      return (
        <TreeItem
          key={node.key}
          node={node}
          collapseIcon={defaultCollapseIcon}
          expandIcon={defaultExpandIcon}
          ContentComponent={ContentComponent}
          treeItemClasses={treeItemClasses}
          onExpand={handleExpand}
          titleRender={titleRender}
          lazyLoadFn={lazyLoadFn}
          renderChildren={renderChildren}
        />
      );
    });
  };
  return (
    <MuiTreeView expanded={expanded} onNodeToggle={handleToggle} {...treeProps}>
      {treeData && renderChildren(null, treeData)}
    </MuiTreeView>
  );
};

export default TreeView;
