import { IConfigOptions } from "./interfaces/IConfigOptions";
import { IPublishOptions } from "./interfaces/IPublishOptions";
import { IQueueBinding } from "./interfaces/IQueueBinding";
declare const _default: {
    publish: (options: IPublishOptions) => Promise<void>;
    subscribe: (options: IQueueBinding) => void;
    setConfig: (options: IConfigOptions) => void;
};
export default _default;
//# sourceMappingURL=index.d.ts.map