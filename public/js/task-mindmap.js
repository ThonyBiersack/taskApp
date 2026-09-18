const renderVersions = new WeakMap();

const renderTaskMindmap = async (container, source, renderId = 'task-mindmap-svg') => {
    if (!container || !window.mermaid || !source) {
        return;
    }

    const version = (renderVersions.get(container) || 0) + 1;
    renderVersions.set(container, version);

    try {
        const { svg } = await window.mermaid.render(renderId, source);

        if (renderVersions.get(container) !== version) {
            return;
        }

        container.innerHTML = svg;
    } catch (error) {
        if (renderVersions.get(container) !== version) {
            return;
        }

        console.error('Could not render task mindmap:', error);
        container.textContent = 'Task map is unavailable right now.';
    }
};

window.renderTaskMindmap = renderTaskMindmap;

const dashboardMindmap = document.querySelector('#task-mindmap');
if (dashboardMindmap) {
    renderTaskMindmap(
        dashboardMindmap,
        decodeURIComponent(dashboardMindmap.dataset.mindmapSource || '')
    );
}
