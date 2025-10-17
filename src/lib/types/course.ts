enum CourseState {
    COURSE_STATE_UNSPECIFIED = "COURSE_STATE_UNSPECIFIED",
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    PROVISIONED = "PROVISIONED",
    DECLINED = "DECLINED",
    SUSPENDED = "SUSPENDED"
}

enum DisplaySettings {
    DISPLAY_SETTINGS_UNSPECIFIED = "DISPLAY_SETTINGS_UNSPECIFIED",
    SHOW_OVERALL_GRADE = "SHOW_OVERALL_GRADE",
    HIDE_OVERALL_GRADE = "HIDE_OVERALL_GRADE",
    SHOW_TEACHERS_ONLY = "SHOW_TEACHERS_ONLY",
}

enum CalculationType {
    CALCULATION_TYPE_UNSPECIFIED = "CALCULATION_TYPE_UNSPECIFIED",
    TOTAL_POINTS = "TOTAL_POINTS",
    WEIGHTED_CATEGORIES = "WEIGHTED_CATEGORIES",
}

interface DriveFolder {
    id: string;
    title: string;
    alternateLink?: string;
}

interface Form {
    formUrl: string;
    responseUrl: string;
    title: string;
    thumbnailUrl?: string;
}

interface Link {
    url: string;
    title?: string;
    thumbnailUrl?: string;
}

interface YoutubeVideo {
    id: string;
    title: string;
    alternateLink?: string;
    thumbnailUrl?: string;
}

interface DriveFile {
    id: string;
    title: string;
    alternateLink?: string;
    thumbnailUrl?: string;
}

interface CourseMaterial {
    driveFile?: DriveFile;
    form?: Form;
    link?: Link;
    youtubeVideo?: YoutubeVideo;
}

interface CourseMaterialSet {
    title?: string;
    materials: CourseMaterial[];
}

interface GradeCategory {
    id: string;
    name: string;
    weight: number;
    defaultGradeDenominator: number;
}

interface GradebookSettings {
    calculationType: CalculationType;
    displaySettings: DisplaySettings;
    gradeCategories: GradeCategory[];
}

interface ClassroomCourse {
    id: string;
    name: string;
    section?: string;
    descriptionHeading?: string;
    description?: string;
    room?: string;
    ownerId: string;
    creationTime: string;
    updateTime: string;
    enrollmentCode?: string;
    courseState: CourseState;
    alternateLink?: string;
    teacherGroupEmail?: string;
    courseGroupEmail?: string;
    teacherFolder?: DriveFolder;
    courseMaterialSets?: CourseMaterialSet[];
    guardiansEnabled?: boolean;
    calendarId?: string;
    gradebookSettings?: GradebookSettings;
}