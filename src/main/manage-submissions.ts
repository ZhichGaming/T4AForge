import { app, BrowserWindow, dialog, Menu, MenuItem } from 'electron';
import path, { parse } from 'path';
import fs from 'fs';
import { SubmissionRecord, SubmissionYearRecord } from '../renderer/types/SubmissionStorage.types';

const USER_DATA_PATH = path.join(app.getPath('userData'), 'submissions');

export function createSubmissionDirectories(year?: number) {
  const submissionsPath = year ? path.join(USER_DATA_PATH, year.toString()) : USER_DATA_PATH;
  fs.mkdirSync(submissionsPath, { recursive: true });
}

export function getSubmissions() {
  const yearList = fs.readdirSync(USER_DATA_PATH).filter((tmp) => !tmp.includes('.DS_Store'));
  let submissions: SubmissionYearRecord[] = [];

  for (const year of yearList) {
    submissions.push({
      year: parseInt(year),
      submissions: getSubmissionsByYear(year),
    });
  }

  return submissions;
}

function getSubmissionsByYear(year: string) {
  const yearPath = path.join(USER_DATA_PATH, year);
  const submissionPaths = fs.readdirSync(yearPath).filter((tmp) => !tmp.includes('.DS_Store'));
  const submissions = submissionPaths.map((submissionPath) => {
    const submissionData = fs.readFileSync(
      path.join(yearPath, submissionPath),
      'utf8',
    );

    const submission = JSON.parse(submissionData);

    return submission as SubmissionRecord;
  });

  return submissions;
}

export function setSubmission(
  year: number,
  submissionData: SubmissionRecord,
) {
  const yearPath = path.join(USER_DATA_PATH, year.toString());

  fs.writeFileSync(path.join(yearPath, submissionData.id), JSON.stringify(submissionData));
}

export function deleteSubmission(year: number, id: string) {
  const yearPath = path.join(USER_DATA_PATH, year.toString());
  fs.unlinkSync(path.join(yearPath, id));
}

export function getNextSubmissionId(year: number) {
  const yearPath = path.join(USER_DATA_PATH, year.toString());
  const latestSubmissionNumber = fs.readdirSync(yearPath)
    .filter((tmp) => !isNaN(parseInt(tmp)))
    .map((fileName) => parseInt(fileName))
    .sort()
    .reverse()[0] ?? 0;

  return (latestSubmissionNumber + 1).toString();
}

export function showYearContextMenu(
  event: Electron.IpcMainInvokeEvent,
  year: number,
) {
  const yearMenu = new Menu();

  yearMenu.append(new MenuItem({
    label: 'Delete Year',
    click: () => {
      const browserWindow = BrowserWindow.fromWebContents(event.sender);

      if (browserWindow === null) {
        return;
      }

      if (dialog.showMessageBoxSync(
        browserWindow,
        {
          type: 'warning',
          buttons: ['Cancel', 'Delete'],
          title: 'Delete Year',
          message: `Are you sure you want to delete the year ${year}?`,
          detail: 'This action cannot be undone.',
        },
      ) === 1) {
        fs.rmSync(path.join(USER_DATA_PATH, year.toString()), { recursive: true });
        event.sender.send('update-submission-list');
      }
    }
  }));

  yearMenu.popup({
    window: BrowserWindow.fromWebContents(event.sender) ?? undefined,
  });
}

export function showSubmissionContextMenu(
  event: Electron.IpcMainInvokeEvent,
  submission: SubmissionRecord,
  year: number,
) {
  const submissionMenu = new Menu();

  submissionMenu.append(new MenuItem({
    label: 'Delete',
    click: () => {
      deleteSubmission(year, submission.id);
      event.sender.send('update-submission-list');
    },
  }));

  submissionMenu.popup({
    window: BrowserWindow.fromWebContents(event.sender) ?? undefined,
  });
}
