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

export const addMouseoverListener = (listener: ListenerWithCallback) => {
    listeners.push(listener);
    initiateMouseoverListener();
};

export const removeMouseoverListener = (listener: Listener) => {
    listeners = listeners.filter(
        (l) => l.id !== listener.id || l.componentId !== listener.componentId
    );
    revokeMouseoverListener();
};

export const initiateMouseoverListener = (forceStart = false) => {
    if (!listenerInitiated && (listeners.length || forceStart)) {
        document.body.addEventListener('mouseover', executeListeners, false);
        listenerInitiated = true;
    }
};

export const revokeMouseoverListener = (forceStop = false) => {
    if (listenerInitiated && (!listeners.length || forceStop)) {
        document.body.removeEventListener('mouseover', executeListeners, false);
        listenerInitiated = false;
    }
};
