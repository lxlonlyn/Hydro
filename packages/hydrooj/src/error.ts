/* eslint-disable max-len */
/* eslint-disable func-names */

interface IHydroError {
    new(...args: any[]): HydroError
}

const Err = (name: string, Class: IHydroError, ...info: Array<(() => string) | string | number>) => {
    let msg: () => string;
    let code: number;
    for (const item of info) {
        if (typeof item === 'number') {
            code = item;
        } else if (typeof item === 'string') {
            msg = function () { return item; };
        } else if (typeof item === 'function') {
            msg = item;
        }
    }
    const HydroError = class extends Class { };
    HydroError.prototype.name = name;
    if (msg) HydroError.prototype.msg = msg;
    if (code) HydroError.prototype.code = code;
    return HydroError;
};

export class HydroError extends Error {
    params: any[];
    code: number;

    constructor(...params: any[]) {
        super();
        this.params = params;
    }

    // eslint-disable-next-line class-methods-use-this
    msg() {
        return 'HydroError';
    }

    get message() {
        return this.msg();
    }
}

export const UserFacingError = Err('UserFacingError', HydroError, 'UserFacingError', 400);
export const SystemError = Err('SystemError', HydroError, 'SystemError', 500);

export const BadRequestError = Err('BadRequestError', UserFacingError, 'BadRequestError', 400);
export const ForbiddenError = Err('ForbiddenError', UserFacingError, 'ForbiddenError', 403);
export const NotFoundError = Err('NotFoundError', UserFacingError, 'NotFoundError', 404);
export const MethodNotAllowedError = Err('MethodNotAllowedError', UserFacingError, 'MethodNotAllowedError', 405);
export const RemoteOnlineJudgeError = Err('RemoteOnlineJudgeError', UserFacingError, 'RemoteOnlineJudgeError', 500);
export const SendMailError = Err('SendMailError', UserFacingError, 'Failed to send mail to {0}. (1)', 500);

export const AlreadyVotedError = Err('AlreadyVotedError', ForbiddenError, "You've already voted.");
export const LoginError = Err('LoginError', ForbiddenError, 'Invalid password for user {0}.');
export const UserAlreadyExistError = Err('UserAlreadyExistError', ForbiddenError, 'User {0} already exists.');
export const InvalidTokenError = Err('InvalidTokenError', ForbiddenError);
export const BlacklistedError = Err('BlacklistedError', ForbiddenError, 'Address or user {0} is blacklisted.');
export const VerifyPasswordError = Err('VerifyPasswordError', ForbiddenError, "Passwords don't match.");
export const OpcountExceededError = Err('OpcountExceededError', ForbiddenError, 'Too frequent operations of {0} (limit: {2} operations in {1} seconds).');
export const PermissionError = Err('PermissionError', ForbiddenError, function (this: HydroError) {
    if (typeof this.params[0] === 'bigint') {
        this.params[0] = require('./model/builtin').PERMS.find(({ key }) => key === this.params[0])?.desc || this.params[0];
    }
    return "You don't have the required permission ({0}) in this domain.";
});
export const PrivilegeError = Err('PrivilegeError', ForbiddenError, function (this: HydroError) {
    if (this.params.includes(global.Hydro.model.builtin.PRIV.PRIV_USER_PROFILE)) {
        return "You're not logged in.";
    }
    return "You don't have the required privilege.";
});
export const ValidationError = Err('ValidationError', ForbiddenError, function (this: HydroError) {
    if (this.params.length === 3) {
        return this.params[1]
            ? 'Field {0} or {1} validation failed. ({2})'
            : 'Field {0} validation failed. ({2})';
    }
    return this.params[1]
        ? 'Field {0} or {1} validation failed.'
        : 'Field {0} validation failed.';
});
export const ContestNotAttendedError = Err('ContestNotAttendedError', ForbiddenError, "You haven't attended this contest yet.");
export const RequireProError = Err('RequireProError', ForbiddenError, 'RequireProError');
export const ContestAlreadyAttendedError = Err('ContestAlreadyAttendedError', ForbiddenError, "You've already attended this contest.");
export const ContestNotLiveError = Err('ContestNotLiveError', ForbiddenError, 'This contest is not live.');
export const ContestNotEndedError = Err('ContestNotEndedError', ForbiddenError, 'This contest is not ended.');
export const ContestScoreboardHiddenError = Err('ContestScoreboardHiddenError', ForbiddenError, 'Contest scoreboard is not visible.');
export const TrainingAlreadyEnrollError = Err('TrainingAlreadyEnrollError', ForbiddenError, "You've already enrolled this training.");
export const HomeworkNotLiveError = Err('HomeworkNotLiveError', ForbiddenError, 'This homework is not open.');
export const HomeworkNotAttendedError = Err('HomeworkNotAttendedError', ForbiddenError, "You haven't claimed this homework yet.");
export const RoleAlreadyExistError = Err('RoleAlreadyExistError', ForbiddenError, 'This role already exists.');
export const CsrfTokenError = Err('CsrfTokenError', ForbiddenError, 'CsrfTokenError');
export const DomainAlreadyExistsError = Err('DomainAlreadyExistsError', ForbiddenError, 'The domain {0} already exists.');
export const DomainJoinForbiddenError = Err('DomainJoinForbiddenError', ForbiddenError, 'You are not allowed to join the domain. The link is either invalid or expired.');
export const DomainJoinAlreadyMemberError = Err('DomainJoinAlreadyMemberError', ForbiddenError, 'Failed to join the domain. You are already a member.');
export const InvalidJoinInvitationCodeError = Err('InvalidJoinInvitationCodeError', ForbiddenError, 'The invitation code you provided is invalid.');
export const CurrentPasswordError = Err('CurrentPasswordError', ForbiddenError, "Current password doesn't match.");

export const UserNotFoundError = Err('UserNotFoundError', NotFoundError, 'User {0} not found.');
export const NoProblemError = Err('NoProblemError', NotFoundError, 'No problem.');
export const RecordNotFoundError = Err('RecordNotFoundError', NotFoundError, 'Record {0} not found.');
export const ProblemDataNotFoundError = Err('ProblemDataNotFoundError', NotFoundError, 'Data of problem {0} not found.');
export const MessageNotFoundError = Err('MessageNotFoundError', NotFoundError, 'Message {0} not found.');
export const DocumentNotFoundError = Err('DocumentNotFoundError', NotFoundError, 'Document {2} not found.');

export const ProblemNotFoundError = Err('ProblemNotFountError', DocumentNotFoundError, 'Problem {1} not found.');
export const SolutionNotFoundError = Err('SolutionNotFoundError', DocumentNotFoundError, 'Solution {1} not found.');
export const TrainingNotFoundError = Err('TrainingNotFoundError', DocumentNotFoundError, 'Training {1} not found.');
export const ContestNotFoundError = Err('ContestNotFoundError', DocumentNotFoundError, 'Contest {1} not found.');
export const DiscussionNotFoundError = Err('DiscussionNotFoundError', DocumentNotFoundError, 'Discussion {1} not found.');
export const DiscussionNodeNotFoundError = Err('DiscussionNodeNotFoundError', DocumentNotFoundError, 'Discussion node {1} not found.');

export const InvalidOperationError = Err('InvalidOperationError', MethodNotAllowedError);
export const FileTooLargeError = Err('FileTooLargeError', ValidationError, 'The uploaded file is too long.');

global.Hydro.error = {
    HydroError,
    BadRequestError,
    BlacklistedError,
    ForbiddenError,
    NotFoundError,
    SendMailError,
    LoginError,
    CsrfTokenError,
    MethodNotAllowedError,
    InvalidOperationError,
    UserAlreadyExistError,
    InvalidTokenError,
    UserNotFoundError,
    VerifyPasswordError,
    ProblemDataNotFoundError,
    OpcountExceededError,
    PermissionError,
    PrivilegeError,
    RequireProError,
    NoProblemError,
    ValidationError,
    ProblemNotFoundError,
    TrainingNotFoundError,
    ContestNotFoundError,
    ContestNotEndedError,
    RecordNotFoundError,
    SolutionNotFoundError,
    AlreadyVotedError,
    ContestNotAttendedError,
    ContestNotLiveError,
    ContestScoreboardHiddenError,
    ContestAlreadyAttendedError,
    DomainAlreadyExistsError,
    DomainJoinAlreadyMemberError,
    DomainJoinForbiddenError,
    InvalidJoinInvitationCodeError,
    UserFacingError,
    SystemError,
    TrainingAlreadyEnrollError,
    HomeworkNotLiveError,
    HomeworkNotAttendedError,
    RemoteOnlineJudgeError,
    DiscussionNodeNotFoundError,
    DocumentNotFoundError,
    DiscussionNotFoundError,
    RoleAlreadyExistError,
    MessageNotFoundError,
    FileTooLargeError,
    CurrentPasswordError,
};

/*
class FileTypeNotAllowedError(ValidationError):
  @property
  def message(self):
    return 'This type of files are not allowed to be uploaded.'

class InvalidTokenDigestError(ForbiddenError):
  pass

class DiscussionCategoryAlreadyExistError(ForbiddenError):
  @property
  def message(self):
    return 'Discussion category {1} already exists.'

class DiscussionCategoryNotFoundError(NotFoundError):
  @property
  def message(self):
    return 'Discussion category {1} not found.'

class DiscussionNodeAlreadyExistError(ForbiddenError):
  @property
  def message(self):
    return 'Discussion node {1} already exists.'

class TrainingRequirementNotSatisfiedError(ForbiddenError):
  @property
  def message(self):
    return 'Training requirement is not satisfied.'

class UsageExceededError(ForbiddenError):
  @property
  def message(self):
    return 'Usage exceeded.'

class InvalidArgumentError(BadRequestError):
  @property
  def message(self):
    return 'Argument {0} is invalid.'
*/
