declare enum ModelsEventEnum {
    RECORD_QUERY_START = "recordQueryStart",
    RECORD_QUERY_END = "recordQueryEnd",
    RECORD_CAMERA_CLICK = "recordCameraClick",
    RECORD_DOOR_CLICK = "RECORD_DOOR_CLICK",
    RECORD_DOOR_CONTROL = "RECORD_DOOR_CONTROL",
    RECORD_DEFENSE_WALL_CLICK = "RECORD_DEFENSE_WALL_CLICK",
    RECORD_VIDEO_MEETING_SELECT = "RECORD_VIDEO_MEETING_SELECT",
    RECORD_VIDEO_MEETING_CLICK = "RECORD_VIDEO_MEETING_CLICK",
    RECORD_VIDEO_QUERY_CIRCLE = "RECORD_VIDEO_QUERY_CIRCLE",
    RECORD_CAMERA_QUERY = "recordCameraQuery",
    QUERY_CIRCLE = "queryCircle",
    QUERY_CIRCLE_NO_DATA = "QUERY_CIRCLE_NO_DATA",
    DRAWING = "drawing",
    CANCEL_DRAWING = "cancelDrawing",
    DETAIL_CAMERA = "detailCamera",
    WARNING = "WARNING",
    WARNING_WAKE = "WARNING_WAKE",
    FLY_TO_WARNING = "FLY_TO_WARNING",
    FLY_TO_RESOURCES = "FLY_TO_RESOURCES",
    LOAD_SYSTEM_INFO = "LOAD_SYSTEM_INFO",
    CHAT_CONTACT_SELECT = "chatContactSelect",
    CHAT_START = "chatStart",
    TRACK_HISTORY = "trackHistory",
    TRACK_CURRENT = "trackCurrent",
    TRACK_MESSAGE = "trackMessage",
    ALARM_HISTORY = "alarmHistory",
    ALARM_HISTORY_LOG = "alarmHistoryLog",
    ALARM_PLAN_DETAIL = "alarmPlanDetail",
    LAYER_ADD_LINE_LAYER = "LAYER_ADD_LINE_LAYER",
    LAYER_REMOVE_LINE_LAYER_BY_NAME = "LAYER_REMOVE_LINE_LAYER_BY_NAME",
    LAYER_REMOVE_LINE_LAYER_BY_LAYER = "LAYER_REMOVE_LINE_LAYER_BY_LAYER",
    VISIBLE_OPERATOR_PANEL = "VISIBLE_OPERATOR_PANEL",
    OPEN_WARNING_CAMERAS_BY_WW_NAME = "OPEN_WARNING_CAMERAS_BY_WW_NAME",
    POINT_TOOL_VISIBLE = "point-tool-visible"
}
export default ModelsEventEnum;
