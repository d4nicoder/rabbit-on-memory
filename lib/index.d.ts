import { IPublishOptions } from "./interfaces/IPublishOptions";
import { IQueueBinding } from "./interfaces/IQueueBinding";
declare const _default: {
    publish: (options: IPublishOptions) => Promise<void>;
    subscribe: <T>(options: IQueueBinding) => void;
};
export default _default;
//# sourceMappingURL=index.d.ts.map