// ==UserScript==
// @name         Jira Get Task
// @namespace    https://YOUR-ANNOYING-COMPANY-DOMAIN.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yohan
// @match        https://pegadaian.atlassian.net/*
// @grant        none
// ==/UserScript==

window.addEventListener("load", () => {
    const button = document.createElement("li");
    button.id = "grab-title-wrapper";
    button.innerHTML = `<a id="grab-title" class="aui-button aui-button-primary aui-style"> Grab Title </a>`;
    const header = document.querySelector(`nav[aria-label="Primary"]`);
    header.insertBefore(button, header.firstChild);
    const grabTitleButton = document.querySelector("#grab-title");
    grabTitleButton.addEventListener("click", getIssueList);
});

const getIssueList = () => {
    const issues = getIssues();
    const issueListText = JSON.stringify(issues);
    const tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = issueListText;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    console.log("issues", issues);
};

const getIssues = () => {
    const issueListItemSelector =  document.querySelector(`[data-testid="issue-navigator.ui.issue-results.detail-view.card-list.card"]`);
    if (typeof(issueListItemSelector) != 'undefined' && issueListItemSelector != null) {
        const issueElements = listFromIssues();
        return issueElements;
    }
    const dashboardTicketListSelector =  document.querySelector('.ghx-issue-subtask');
    if (typeof(dashboardTicketListSelector) != 'undefined' && dashboardTicketListSelector != null) {
        const issueElements = listFromBoard();
        return issueElements;
    }
    return null;
}

const listFromIssues = () => {
    console.log('============');
    console.log('TASKS FROM ISSUES');
    console.log('============');
    const issueList = [];
    const issueElements = document.querySelectorAll(`[data-testid="issue-navigator.ui.issue-results.detail-view.card-list.card"]`);
    for (const el of issueElements) {
        const titleEl = el.querySelector(`[data-testid="issue-navigator.ui.issue-results.detail-view.card-list.card.summary"]`);
        const codeEl = el.querySelector(`[data-testid="issue-navigator.ui.issue-results.detail-view.card-list.card.summary"]`).nextSibling.querySelectorAll(`div`)[0];
        const title = titleEl.textContent;
        const code = codeEl.textContent;
        const issue = {
            description: title,
            jira: code
        };
        issueList.push(issue);
    }
    return issueList;
}
const listFromBoard = () => {
    console.log('============');
    console.log('TASKS FROM BOARD');
    console.log('============');
    const issueList = [];
    const issueElements = document.querySelectorAll(".ghx-issue-subtask");
    for (const el of issueElements) {
        const title = el.querySelectorAll(".ghx-summary")[0].getAttribute("title");
        const code = el.querySelectorAll(".ghx-key")[0].getAttribute("data-tooltip");
        const issue = {
            description: title,
            jira: code
        };
        issueList.push(issue);
    }
    return issueList;
}
