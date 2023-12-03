type Listener = {
    id: string;
    componentId: string;
};

type ListenerWithCallback = Listener & {
    callback: CallableFunction;
};

let listeners: ListenerWithCallback[] = [];
let listenerInitiated: boolean = false;

const executeListeners = (event: FocusEvent) => {
    for (const listener of listeners) {
        listener.callback(event);
    }
};

export const addFocusoutListener = (listener: ListenerWithCallback) => {
    listeners.push(listener);
    initiateFocusoutListener();
};

export const removeFocusoutListener = (listener: Listener) => {
    listeners = listeners.filter(
        (l) => l.id !== listener.id || l.componentId !== listener.componentId
    );
    revokeFocusoutListener();
};

export const initiateFocusoutListener = (forceStart = false) => {
    if (!listenerInitiated && (listeners.length || forceStart)) {
        document.body.addEventListener('focusout', executeListeners, false);
        listenerInitiated = true;
    }
};

export const revokeFocusoutListener = (forceStop = false) => {
    if (listenerInitiated && (!listeners.length || forceStop)) {
        document.body.removeEventListener('focusout', executeListeners, false);
        listenerInitiated = false;
    }
};
