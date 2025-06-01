"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeaveDto = exports.CreateLeaveDto = void 0;
const class_validator_1 = require("class-validator");
const LeaveRequest_1 = require("../models/LeaveRequest");
const class_transformer_1 = require("class-transformer");
class CreateLeaveDto {
}
exports.CreateLeaveDto = CreateLeaveDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsEnum)(LeaveRequest_1.LeaveType, { message: 'type 必須為 事假 或 病假' }),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "type", void 0);
class UpdateLeaveDto {
}
exports.UpdateLeaveDto = UpdateLeaveDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsEnum)(LeaveRequest_1.LeaveType, { message: 'type 必須為 事假 或 病假' }),
    __metadata("design:type", String)
], UpdateLeaveDto.prototype, "type", void 0);
