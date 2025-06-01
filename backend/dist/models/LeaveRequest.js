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
exports.LeaveRequest = exports.LeaveStatus = exports.LeaveType = void 0;
const typeorm_1 = require("typeorm");
const Session_1 = require("./Session");
const User_1 = require("./User");
var LeaveType;
(function (LeaveType) {
    LeaveType["PERSONAL"] = "\u4E8B\u5047";
    LeaveType["SICK"] = "\u75C5\u5047";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["ACTIVE"] = "active";
    LeaveStatus["CANCELLED"] = "cancelled";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
let LeaveRequest = class LeaveRequest {
};
exports.LeaveRequest = LeaveRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "session_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Session_1.Session),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", Session_1.Session)
], LeaveRequest.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", User_1.User)
], LeaveRequest.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
        enum: LeaveType,
    }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
        enum: LeaveStatus,
        default: LeaveStatus.ACTIVE
    }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "cancelled_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "created_by", void 0);
exports.LeaveRequest = LeaveRequest = __decorate([
    (0, typeorm_1.Entity)()
], LeaveRequest);
