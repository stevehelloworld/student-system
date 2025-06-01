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
exports.MakeUpSession = exports.MakeUpAttendanceStatus = void 0;
const typeorm_1 = require("typeorm");
const LeaveRequest_1 = require("./LeaveRequest");
const User_1 = require("./User");
var MakeUpAttendanceStatus;
(function (MakeUpAttendanceStatus) {
    MakeUpAttendanceStatus["PRESENT"] = "PRESENT";
    MakeUpAttendanceStatus["ABSENT"] = "ABSENT";
    MakeUpAttendanceStatus["LATE"] = "LATE";
})(MakeUpAttendanceStatus || (exports.MakeUpAttendanceStatus = MakeUpAttendanceStatus = {}));
let MakeUpSession = class MakeUpSession {
};
exports.MakeUpSession = MakeUpSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MakeUpSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MakeUpSession.prototype, "leave_request_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LeaveRequest_1.LeaveRequest, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'leave_request_id' }),
    __metadata("design:type", LeaveRequest_1.LeaveRequest)
], MakeUpSession.prototype, "leave_request", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], MakeUpSession.prototype, "make_up_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MakeUpSession.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MakeUpSession.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MakeUpSession.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", User_1.User)
], MakeUpSession.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MakeUpSession.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MakeUpSession.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
        enum: MakeUpAttendanceStatus,
        nullable: true
    }),
    __metadata("design:type", String)
], MakeUpSession.prototype, "attendance_status", void 0);
exports.MakeUpSession = MakeUpSession = __decorate([
    (0, typeorm_1.Entity)()
], MakeUpSession);
