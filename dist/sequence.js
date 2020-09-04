"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySequence = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const SequenceActions = rest_1.RestBindings.SequenceActions;
let MySequence = class MySequence {
    constructor(findRoute, parseParams, invoke, send, reject, authenticateRequest) {
        this.findRoute = findRoute;
        this.parseParams = parseParams;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
        this.authenticateRequest = authenticateRequest;
        /**
         * Optional invoker for registered middleware in a chain.
         * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
         */
        this.invokeMiddleware = () => false;
    }
    async handle(context) {
        var _a;
        try {
            const { request, response } = context;
            const finished = await this.invokeMiddleware(context);
            if (finished)
                return;
            const route = this.findRoute(request);
            // usually authentication is done before proceeding to parse params
            // but in our case we need the path params to know the provider name
            const args = await this.parseParams(request, route);
            // if provider name is available in the request path params, set it in the query
            if ((_a = route.pathParams) === null || _a === void 0 ? void 0 : _a.provider) {
                request.query['oauth2-provider-name'] = route.pathParams.provider;
            }
            //call authentication action
            await this.authenticateRequest(request);
            // Authentication successful, proceed to invoke controller
            const result = await this.invoke(route, args);
            this.send(response, result);
        }
        catch (error) {
            /**
             * Authentication errors for login page are handled by the express app
             */
            if (context.request.path === '/login' &&
                (error.status === 401 || error.name === 'UnauthorizedError')) {
                /**
                 * The express app that routed the /signup call to LB App, will handle the error event.
                 */
                context.response.emit('UnauthorizedError', 'User Authentication Failed');
                return;
            }
            if (error.code === authentication_1.AUTHENTICATION_STRATEGY_NOT_FOUND ||
                error.code === authentication_1.USER_PROFILE_NOT_FOUND) {
                Object.assign(error, { statusCode: 401 /* Unauthorized */ });
            }
            this.reject(context, error);
            return;
        }
    }
};
tslib_1.__decorate([
    core_1.inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true }),
    tslib_1.__metadata("design:type", Function)
], MySequence.prototype, "invokeMiddleware", void 0);
MySequence = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(SequenceActions.FIND_ROUTE)),
    tslib_1.__param(1, core_1.inject(SequenceActions.PARSE_PARAMS)),
    tslib_1.__param(2, core_1.inject(SequenceActions.INVOKE_METHOD)),
    tslib_1.__param(3, core_1.inject(SequenceActions.SEND)),
    tslib_1.__param(4, core_1.inject(SequenceActions.REJECT)),
    tslib_1.__param(5, core_1.inject(authentication_1.AuthenticationBindings.AUTH_ACTION)),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Function, Function, Function, Function])
], MySequence);
exports.MySequence = MySequence;
//# sourceMappingURL=sequence.js.map