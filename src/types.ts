export type TreeNode = {
    title: string;
    key: string;
    children?: TreeNode[];
    disabled?: boolean;
    data?: Record<string, any>;
};
