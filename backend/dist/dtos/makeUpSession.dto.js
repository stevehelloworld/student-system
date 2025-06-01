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
exports.UpdateMakeUpSessionDto = exports.CreateMakeUpSessionDto = void 0;
const class_transformer_1 = require("class-transformer");
class CreateMakeUpSessionDto {
}
exports.CreateMakeUpSessionDto = CreateMakeUpSessionDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], CreateMakeUpSessionDto.prototype, "course_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], CreateMakeUpSessionDto.prototype, "date", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateMakeUpSessionDto.prototype, "start_time", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateMakeUpSessionDto.prototype, "end_time", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateMakeUpSessionDto.prototype, "location", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CreateMakeUpSessionDto.prototype, "student_ids", void 0);
class UpdateMakeUpSessionDto {
}
exports.UpdateMakeUpSessionDto = UpdateMakeUpSessionDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UpdateMakeUpSessionDto.prototype, "date", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateMakeUpSessionDto.prototype, "start_time", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateMakeUpSessionDto.prototype, "end_time", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateMakeUpSessionDto.prototype, "location", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UpdateMakeUpSessionDto.prototype, "student_ids", void 0);
