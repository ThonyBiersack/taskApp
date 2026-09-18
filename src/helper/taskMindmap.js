const formatDeadline = (deadline) => {
    if (!deadline) {
        return 'No deadline';
    }

    return new Date(deadline).toLocaleDateString('en-ID', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const taskLabel = (task) => {
    const title = String(task.title || 'Untitled task').trim();
    const deadline = formatDeadline(task.deadline);
    return `${title} - ${deadline}`;
};

const descriptionChildren = (description) => {
    const roots = [];
    const stack = [];

    String(description || '').split(/\r?\n/).forEach((line) => {
        if (!line.trim()) return;

        const bullet = line.match(/^(\s*)-\s+(.*)$/);
        const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
        const rawIndent = bullet ? bullet[1].replace(/\t/g, '    ').length : 0;
        const node = {
            label: (bullet ? bullet[2] : numbered ? numbered[1] : line).trim(),
            children: []
        };

        if (numbered) {
            roots.push(node);
            stack.length = 0;
            stack.push({ indent: 0, node, numbered: true });
            return;
        }

        const isNumberedChild = bullet && stack.length && stack[0].numbered && rawIndent === 0;
        const indent = bullet && (isNumberedChild || stack[stack.length - 1].indent === rawIndent)
            ? rawIndent + 1
            : rawIndent;

        while (stack.length && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }

        if (stack.length) {
            stack[stack.length - 1].node.children.push(node);
        } else {
            roots.push(node);
        }

        stack.push({ indent, node });
    });

    return roots;
};

const toSingleTaskMindmapData = (task) => ({
    label: task.title || 'Untitled task',
    children: descriptionChildren(task.description)
});

const toTaskMindmapData = (tasks) => ({
    label: 'My tasks',
    children: [
        {
            label: 'Active',
            children: tasks
                .filter((task) => task.status !== 'done')
                .map((task) => ({
                    label: taskLabel(task),
                    children: task.description
                        ? [{ label: String(task.description).trim() }]
                        : []
                }))
        },
        {
            label: 'Done',
            children: tasks
                .filter((task) => task.status === 'done')
                .map((task) => ({ label: taskLabel(task) }))
        }
    ]
});

const escapeMindmapLabel = (label) => String(label)
    .replace(/\\/g, '\\\\')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/[\r\n]+/g, ' ')
    .trim();

const toMermaidMindmap = (tasks) => {
    const tree = toTaskMindmapData(tasks);
    const lines = ['mindmap', `  root((${escapeMindmapLabel(tree.label)}))`];

    const addChildren = (children, depth) => {
        children.forEach((child) => {
            lines.push(`${'  '.repeat(depth)}${escapeMindmapLabel(child.label)}`);
            addChildren(child.children || [], depth + 1);
        });
    };

    addChildren(tree.children, 2);
    return lines.join('\n');
};

const toTaskMermaidMindmap = (task) => {
    const tree = toSingleTaskMindmapData(task);
    const lines = ['mindmap', `  root((${escapeMindmapLabel(tree.label)}))`];

    const addChildren = (childrenToAdd, depth) => {
        childrenToAdd.forEach((child) => {
            lines.push(`${'  '.repeat(depth)}${escapeMindmapLabel(child.label)}`);
            addChildren(child.children || [], depth + 1);
        });
    };

    addChildren(tree.children, 2);

    return lines.join('\n');
};

export { toTaskMindmapData, toMermaidMindmap, toSingleTaskMindmapData, toTaskMermaidMindmap };
