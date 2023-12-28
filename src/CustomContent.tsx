import { Box } from "@mui/material";
import { TreeItemContentProps, useTreeItem } from "@mui/x-tree-view/TreeItem";
import classNames from "classnames";
import { forwardRef } from "react";

const CustomContent = forwardRef(function CustomContent(
    props: TreeItemContentProps,
    ref
) {
    const { classes, className, label, nodeId } = props;
    const {
        disabled,
        expanded,
        selected,
        focused,
        handleSelection,
        handleExpansion,
    } = useTreeItem(nodeId);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        handleExpansion(event);
        handleSelection(event);
        if (props.onClick) {
            props.onClick(event);
        }
    };

    return (
        <Box
            className={classNames(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            sx={{
                padding: "0px 8px",
            }}
            onClick={handleClick}
            ref={ref as React.Ref<HTMLDivElement>}
        >
            {label}
        </Box>
    );
});

export default CustomContent;
