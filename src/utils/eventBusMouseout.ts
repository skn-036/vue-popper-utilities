type Listener = {
    id: string;
    componentId: string;
};

type ListenerWithCallback = Listener & {
    callback: CallableFunction;
};

let listeners: ListenerWithCallback[] = [];
let listenerInitiated: boolean = false;

const executeListeners = (event: MouseEvent) => {
    for (const listener of listeners) {
        listener.callback(event);
    }
};

export const addMouseoutListener = (listener: ListenerWithCallback) => {
    listeners.push(listener);
    initiateMouseoutListener();
};

export const removeMouseoutListener = (listener: Listener) => {
    listeners = listeners.filter(
        (l) => l.id !== listener.id || l.componentId !== listener.componentId
    );
    revokeMouseoutListener();
};

export const initiateMouseoutListener = (forceStart = false) => {
    if (!listenerInitiated && (listeners.length || forceStart)) {
        document.body.addEventListener('mouseout', executeListeners, false);
        listenerInitiated = true;
    }
};

export const revokeMouseoutListener = (forceStop = false) => {
    if (listenerInitiated && (!listeners.length || forceStop)) {
        document.body.removeEventListener('mouseout', executeListeners, false);
        listenerInitiated = false;
    }
};
