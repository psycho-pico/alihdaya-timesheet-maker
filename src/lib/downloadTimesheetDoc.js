import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import {saveAs} from "file-saver";
import {dateIsWeekend, getAllDaysInMonth, getFormattedTimesheetDate} from "./months";
import {addDotToEndOfString, notNull} from "./helper";
import moment from "moment";

let PizZipUtils = null;

if (typeof window !== "undefined") {
    import("pizzip/utils/index.js").then(function (r) {
        PizZipUtils = r;
    });
}

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

const getJiras = (objects) => {
    return objects.map((object, key) => {
        return {jira: object.jira, key: key};
    }).filter(({jira}) => notNull(jira));
}

const getCrfs = (objects) => {
    return objects.map((object, key) => {
        return {crf: object.crf, key: key};
    }).filter(({crf}) => notNull(crf));
}

const getDescriptions = (objects, asteriskOrder_, jiras_, crfs_, isOvertime = false, isWeekend = false) => {
    let showOvertime = true;
    let firstRow = true;
    return objects.map((object, key) => {
        let overtimeLabel = "";
        let nlSeparatorOvertime = "";
        let nlSeparator = "\n";
        if (isOvertime && showOvertime) {
            overtimeLabel = (isWeekend ? "" : "\n\n") + "Overtime\n";
            nlSeparatorOvertime = "\n";
            showOvertime = false;
        }
        if (firstRow) {
            nlSeparator = "";
            firstRow = false;
        }
        const jiraIndex = jiras_.findIndex((object) => object.key === key);
        const crfIndex = crfs_.findIndex((object) => object.key === key);
        const asteriskOrder = jiraIndex !== -1 || crfIndex !== -1 ? asteriskOrder_[0] += 1 : 0;
        const asteriskDescription = "*".repeat(asteriskOrder);
        let newDescription = `${overtimeLabel}${nlSeparator}- ${addDotToEndOfString(object.description)} ${asteriskDescription}`;
        if (asteriskOrder > 0 && jiras_[jiraIndex]) {
            jiras_[jiraIndex].jira = `${nlSeparatorOvertime}${nlSeparator}${asteriskDescription} ${jiras_[jiraIndex].jira}`;
        }
        if (asteriskOrder > 0 && crfs_[crfIndex]) {
            crfs_[crfIndex].crf = `${nlSeparatorOvertime}${nlSeparator}${asteriskDescription} ${crfs_[crfIndex].crf}`;
        }
        return {
            description: newDescription,
            key: key
        };
    }).filter(({description}) => notNull(description));
}

const groupTaskByWeek = (dates) => {
    const groupedTask = [];
    dates.map((date, key) => {
        const yearWeekKey = `${moment(date.datePlain).year()}-${moment(date.datePlain).week()}`;
        const indexNewGroup = groupedTask.findIndex((object) => object.weekKey === yearWeekKey);
        if (indexNewGroup === -1) {
            const newWeek = {
                week: `Week ${groupedTask.length + 1}`,
                weekKey: yearWeekKey,
                dts: [date]
            }
            groupedTask.push(newWeek);
            return;
        }
        groupedTask[indexNewGroup].dts.push(date);
    }, {});
    return groupedTask;
}

const downloadTimesheetDoc = (dispatch, storedVariablesData, selectedYear, selectedMonth, storedTask) => {
    const FILE_NAME = `${storedVariablesData?.full_name || 'full_name'} – Monthly Report ${selectedMonth?.name || today.getMonth()} ${selectedYear || today.getFullYear()}`;
    let dates = getAllDaysInMonth(selectedYear, selectedMonth?.id).map((day, key) => {
        const isWeekend = dateIsWeekend(day);
        let dayStored = storedTask?.find(object => object.date.toString() === day.getDate().toString());
        let dayStoredTask = dayStored?.task || [];
        let dayStoredOvertime = dayStored?.overtime || [];
        let descriptions = [];
        let descriptionsTask = [];
        let descriptionsOvertime = [];
        let jiras = [];
        let jirasTask = [];
        let jirasOvertime = [];
        let crfs = [];
        let crfsTask = [];
        let crfsOvertime = [];

        let asteriskOrder = [0];
        if (dayStoredTask.length > 0) {
            jirasTask = getJiras(dayStoredTask);
            crfsTask = getCrfs(dayStoredTask);
            descriptionsTask = getDescriptions(dayStoredTask, asteriskOrder, jirasTask, crfsTask);
        }
        if (dayStoredOvertime.length > 0) {
            jirasOvertime = getJiras(dayStoredOvertime);
            crfsOvertime = getCrfs(dayStoredOvertime);
            descriptionsOvertime = getDescriptions(dayStoredOvertime, asteriskOrder, jirasOvertime, crfsOvertime, true, isWeekend);
        }
        descriptions = [...descriptionsTask, ...descriptionsOvertime];
        jiras = [...jirasTask, ...jirasOvertime];
        crfs = [...crfsTask, ...crfsOvertime];

        let durationHour = 0;
        if (isWeekend && descriptionsOvertime?.length > 0) {
            durationHour = 1;
        }
        if (!isWeekend && descriptionsTask?.length > 0 && descriptionsOvertime?.length > 0) {
            durationHour = 1.5;
        }
        if (!isWeekend && descriptionsTask?.length > 0) {
            durationHour = 1;
        }

        if (descriptions.length === 0) {
            descriptions.push({description: "-"})
        }
        if (jiras.length === 0) {
            jiras.push({jira: "-"})
        }
        if (crfs.length === 0) {
            crfs.push({crf: "-"})
        }

        if (isWeekend && dayStoredOvertime.length === 0) {
            return null;
        }

        return {
            datePlain: day,
            date: getFormattedTimesheetDate(day),
            isWeekend: isWeekend ? '\nWeekend' : '',
            descriptions: descriptions,
            jiras: jiras,
            crfs: crfs,
            duration: durationHour || '',
        }
    }).filter((object) => object !== null).map((object, key) => {
        return {i: key + 1, ...object}
    });

    const weeks = groupTaskByWeek(dates);

    loadFile("/report-templates/monthly-report-innovatz.docx", function (
        error,
        content
    ) {
        if (error) {
            throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {linebreaks: true});
        const today = new Date();
        doc.setData({
            date: today.getDate(),
            month_name: selectedMonth?.name || today.getMonth(),
            full_year: selectedYear || today.getFullYear(),
            full_name: storedVariablesData?.full_name || "-",
            work_unit: storedVariablesData?.work_unit || "-",
            reporting_manager: storedVariablesData?.reporting_manager || "-",
            job_position: storedVariablesData?.job_position || "-",
            working_company: storedVariablesData?.working_company || "-",
            kepala_divisi: storedVariablesData?.kepala_divisi || "-",
            weeks: weeks
        });
        try {
            doc.render();
        } catch (error) {
            function replaceErrors(key, value) {
                if (value instanceof Error) {
                    return Object.getOwnPropertyNames(value).reduce(function (
                            error,
                            key
                        ) {
                            error[key] = value[key];
                            return error;
                        },
                        {});
                }
                return value;
            }

            console.log(JSON.stringify({error: error}, replaceErrors));

            if (error.properties && error.properties.errors instanceof Array) {
                const errorMessages = error.properties.errors
                    .map(function (error) {
                        return error.properties.explanation;
                    })
                    .join("\n");
                console.log("errorMessages", errorMessages);
            }
            throw error;
        }
        const out = doc.getZip().generate({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(out, `${FILE_NAME}.docx`);
    });
}

export default downloadTimesheetDoc;