type EventProperties = string | number | boolean | Record<string, unknown>;

interface EmailEventWithUserEmail {
    email: string;
    eventName: string;
    eventProperties?: EventProperties;
}

interface EmailEventWithUserId {
    userId: string;
    eventName: string;
    eventProperties?: EventProperties;
}

type EmailEvent = EmailEventWithUserEmail | EmailEventWithUserId;