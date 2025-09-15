/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TaskController } from './controllers/task-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SkillController } from './controllers/skill-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DeveloperController } from './controllers/developer-controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Skill": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "developers": {"dataType":"array","array":{"dataType":"refObject","ref":"Developer"},"required":true},
            "tasks": {"dataType":"array","array":{"dataType":"refObject","ref":"Task"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Task": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "requiredSkills": {"dataType":"array","array":{"dataType":"refObject","ref":"Skill"},"required":true},
            "assignedDeveloper": {"dataType":"union","subSchemas":[{"ref":"Developer"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Developer": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "skills": {"dataType":"array","array":{"dataType":"refObject","ref":"Skill"},"required":true},
            "tasks": {"dataType":"array","array":{"dataType":"refObject","ref":"Task"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsTaskController_getTasks: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/tasks',
            ...(fetchMiddlewares<RequestHandler>(TaskController)),
            ...(fetchMiddlewares<RequestHandler>(TaskController.prototype.getTasks)),

            async function TaskController_getTasks(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTaskController_getTasks, request, response });

                const controller = new TaskController();

              await templateService.apiHandler({
                methodName: 'getTasks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTaskController_createTask: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"skillIds":{"dataType":"array","array":{"dataType":"string"},"required":true},"title":{"dataType":"string","required":true}}},
        };
        app.post('/tasks',
            ...(fetchMiddlewares<RequestHandler>(TaskController)),
            ...(fetchMiddlewares<RequestHandler>(TaskController.prototype.createTask)),

            async function TaskController_createTask(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTaskController_createTask, request, response });

                const controller = new TaskController();

              await templateService.apiHandler({
                methodName: 'createTask',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTaskController_assignTask: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"developerId":{"dataType":"string","required":true},"taskId":{"dataType":"string","required":true}}},
        };
        app.post('/tasks/assign',
            ...(fetchMiddlewares<RequestHandler>(TaskController)),
            ...(fetchMiddlewares<RequestHandler>(TaskController.prototype.assignTask)),

            async function TaskController_assignTask(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTaskController_assignTask, request, response });

                const controller = new TaskController();

              await templateService.apiHandler({
                methodName: 'assignTask',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTaskController_unassignTask: Record<string, TsoaRoute.ParameterSchema> = {
                taskId: {"in":"path","name":"taskId","required":true,"dataType":"string"},
        };
        app.post('/tasks/:taskId/unassign',
            ...(fetchMiddlewares<RequestHandler>(TaskController)),
            ...(fetchMiddlewares<RequestHandler>(TaskController.prototype.unassignTask)),

            async function TaskController_unassignTask(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTaskController_unassignTask, request, response });

                const controller = new TaskController();

              await templateService.apiHandler({
                methodName: 'unassignTask',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSkillController_getSkills: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/skills',
            ...(fetchMiddlewares<RequestHandler>(SkillController)),
            ...(fetchMiddlewares<RequestHandler>(SkillController.prototype.getSkills)),

            async function SkillController_getSkills(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSkillController_getSkills, request, response });

                const controller = new SkillController();

              await templateService.apiHandler({
                methodName: 'getSkills',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDeveloperController_getDevelopers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/developers',
            ...(fetchMiddlewares<RequestHandler>(DeveloperController)),
            ...(fetchMiddlewares<RequestHandler>(DeveloperController.prototype.getDevelopers)),

            async function DeveloperController_getDevelopers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeveloperController_getDevelopers, request, response });

                const controller = new DeveloperController();

              await templateService.apiHandler({
                methodName: 'getDevelopers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
