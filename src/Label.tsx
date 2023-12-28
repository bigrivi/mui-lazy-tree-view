import { useEffect } from "react";
import { useTreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeNode } from "./types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const DEFAULT_COLLAPSE_ICON = <ExpandMoreIcon />;
const DEFAULT_EXPAND_ICON = <ChevronRightIcon />;

const TreeItemLabel = ({
  node,
  titleRender,
  onLazyLoad,
  loading,
  collapseIcon = DEFAULT_COLLAPSE_ICON,
  expandIcon = DEFAULT_EXPAND_ICON,
}: {
  node: TreeNode;
  loading?: boolean;
  collapseIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  titleRender?: (node: TreeNode) => React.ReactNode;
  onLazyLoad?: () => void;
}) => {
  const { expanded, handleExpansion, preventSelection, handleSelection } =
    useTreeItem(node.key);
  const hasLazyLoad =
    typeof node.children != "undefined" && node.children.length == 0;

  const handleExpansionClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (loading) {
      return;
    }
    if (hasLazyLoad) {
      onLazyLoad && onLazyLoad();
    } else {
      handleExpansion(event);
    }
    event.stopPropagation();
    event.preventDefault();
    preventSelection(event);
  };

  useEffect(() => {
    if (expanded && hasLazyLoad) {
      onLazyLoad && onLazyLoad();
    }
  }, [expanded]);

  const hasChildren = typeof node.children != "undefined";

  const icon = hasChildren ? (
    <div onClick={handleExpansionClick} className="MuiTreeItem-iconContainer">
      {expanded && collapseIcon}
      {!expanded && expandIcon}
    </div>
  ) : (
    <div className="MuiTreeItem-iconContainer"></div>
  );
  return (
    <>
      {loading && (
        <div className="MuiTreeItem-iconContainer">
          <CircularProgress color="inherit" size={12} />
        </div>
      )}
      {!loading && icon}
      <div className="MuiTreeItem-label">
        {titleRender ? titleRender(node) : node.title}
      </div>
    </>
  );
};

export default TreeItemLabel;
