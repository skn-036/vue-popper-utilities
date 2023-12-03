export const isObject = (data: unknown) => {
    if (typeof data === 'object' && !Array.isArray(data) && data !== null)
        return true;
    return false;
};

export const isArray = (data: unknown) => Array.isArray(data);

export const filterArrayUniqueByKey = (
    array: Record<string, any>[],
    key: string = 'id'
) => {
    const arrayKeys = array.map((a) => a[key]);
    return array.filter((a, i) => arrayKeys.indexOf(a[key]) === i);
};

export const deepCompareArray = (
    priority: Record<string, any>[],
    base: Record<string, any>[],
    arrayKey: string = 'id',
    appendNotMatchedBasedItems: boolean = true
): Record<string, any>[] => {
    if (!isArray(priority) || !isArray(base)) {
        return isArray(priority)
            ? priority
            : isArray(base)
            ? base
            : priority || base;
    }

    if (
        priority.every((p) => !isObject(p) && !isArray(p)) &&
        base.every((b) => !isObject(b) && !isArray(b))
    ) {
        return priority;
    }

    let compared = priority.map((item) => {
        const itemInBase = base.find((b) => b[arrayKey] == item[arrayKey]);

        if (isArray(item) && isArray(itemInBase)) {
            return deepCompareArray(
                item as Record<string, any>[],
                itemInBase as Record<string, any>[],
                arrayKey
            );
        } else if (isObject(item) && isObject(itemInBase)) {
            return deepCompare(
                item,
                itemInBase as Record<string, any>,
                arrayKey
            );
        } else {
            return item;
        }
    });

    const priorityArrayKey = priority
        .map((p) => (p[arrayKey] ? p[arrayKey]?.toString() : null))
        .filter((p) => p);

    let baseItemsNotExistsInPriority: Record<string, any>[] = [];

    if (appendNotMatchedBasedItems) {
        baseItemsNotExistsInPriority = base.filter((b) => {
            if (!b[arrayKey]) return false;
            return !priorityArrayKey.includes(b[arrayKey]?.toString());
        });
    }

    return [...compared, ...baseItemsNotExistsInPriority];
};

export const deepCompare = (
    priority: Record<string, any>,
    base: Record<string, any>,
    arrayKey: string = 'id',
    appendNotMatchedBasedItems: boolean = true
): Record<string, any> => {
    const priorityKeys = Object.keys(priority);
    const baseKeys = Object.keys(base);

    const priorityKeysNotExistsInBase = priorityKeys.filter(
        (key) => !baseKeys.includes(key)
    );

    let compared: Record<string, any> = Object.keys(base).reduce(
        (result, key) => {
            if (priority.hasOwnProperty(key)) {
                if (isObject(priority[key]) && isObject(base[key])) {
                    return {
                        ...result,
                        [key]: deepCompare(priority[key], base[key], arrayKey),
                    };
                } else if (isArray(priority[key]) && isArray(base[key])) {
                    return {
                        ...result,
                        [key]: deepCompareArray(
                            priority[key],
                            base[key],
                            arrayKey
                        ),
                    };
                } else {
                    return { ...result, [key]: priority[key] };
                }
            } else {
                return { ...result, [key]: base[key] };
            }
        },
        {}
    );

    if (appendNotMatchedBasedItems && priorityKeysNotExistsInBase.length) {
        priorityKeysNotExistsInBase.forEach((key) => {
            compared = { ...compared, [key]: priority[key] };
        });
    }
    return compared;
};

export const hasEventOccuredInChildTree = (
    event: MouseEvent | FocusEvent,
    idToMatch: string
) => {
    const el = event.target as HTMLElement;

    if (el.id === idToMatch) return true;

    let matched = false;
    let targetEl: HTMLElement | null = el;

    while (!matched && targetEl && targetEl.parentElement) {
        if (targetEl.id === idToMatch) matched = true;
        targetEl = targetEl?.parentElement;
    }

    return matched;
};
