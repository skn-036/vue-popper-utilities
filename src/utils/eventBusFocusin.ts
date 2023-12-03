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

export const addFocusinListener = (listener: ListenerWithCallback) => {
    listeners.push(listener);
    initiateFocusinListener();
};

export const removeFocusinListener = (listener: Listener) => {
    listeners = listeners.filter(
        (l) => l.id !== listener.id || l.componentId !== listener.componentId
    );
    revokeFocusinListener();
};

export const initiateFocusinListener = (forceStart = false) => {
    if (!listenerInitiated && (listeners.length || forceStart)) {
        document.body.addEventListener('focusin', executeListeners, false);
        listenerInitiated = true;
    }
};

export const revokeFocusinListener = (forceStop = false) => {
    if (listenerInitiated && (!listeners.length || forceStop)) {
        document.body.removeEventListener('focusin', executeListeners, false);
        listenerInitiated = false;
    }
};
