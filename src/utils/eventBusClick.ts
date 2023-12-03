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

export const addClickListener = (listener: ListenerWithCallback) => {
    listeners.push(listener);
    initiateClickListener();
};

export const removeClickListener = (listener: Listener) => {
    listeners = listeners.filter(
        (l) => l.id !== listener.id || l.componentId !== listener.componentId
    );
    revokeClickListener();
};

export const initiateClickListener = (forceStart = false) => {
    if (!listenerInitiated && (listeners.length || forceStart)) {
        document.body.addEventListener('click', executeListeners, false);
        listenerInitiated = true;
    }
};

export const revokeClickListener = (forceStop = false) => {
    if (listenerInitiated && (!listeners.length || forceStop)) {
        document.body.removeEventListener('click', executeListeners, false);
        listenerInitiated = false;
    }
};
