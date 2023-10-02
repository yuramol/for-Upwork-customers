import React, { useEffect, useMemo, useState } from 'react';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Stack, Typography } from '@mui/material';

import { MainWrapper, ReportTable } from '../../components';
import { PageProps } from '../types';
import { useNormalizedTrackers, useAuthUser } from 'hooks';
import { getFormattedDate, getHours } from 'helpers';
import { ReportPageSidebar } from './ReportPageSidebar';
import { breaksTitles } from 'constant';

const ReportPage: React.FC<PageProps> = ({ title }) => {
  const { user, isManager } = useAuthUser();

  const [selectedDates, setSelectedDates] = useState([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [checked, setChecked] = useState(true);

  let reportFilter = {};
  if (isManager) {
    reportFilter = {
      user: { id: { in: [user.id] } },
      ...(selectedEmployees.length > 0
        ? {
            user: {
              id: { in: selectedEmployees },
            },
          }
        : {}),
      ...(selectedProjects.length > 0
        ? {
            project: {
              id: { in: selectedProjects },
            },
          }
        : {}),
      date:
        selectedDates.length > 1
          ? {
              between: [
                getFormattedDate(selectedDates[0]),
                getFormattedDate(selectedDates[1]),
              ],
            }
          : { eq: getFormattedDate(selectedDates[0]) },
    };
  } else {
    reportFilter = {
      user: { id: { in: [user.id] } },
    };
  }
  const { fetchTrackers, normalizedTrackers } = useNormalizedTrackers(
    reportFilter,
    true
  );

  useEffect(() => {
    fetchTrackers({
      variables: { filters: reportFilter },
    });
  }, [selectedDates, selectedEmployees, selectedProjects, user.id]);

  const totalTracked = useMemo(() => {
    let totalTime = 0;
    normalizedTrackers.forEach(({ total }) => (totalTime += total));

    return totalTime;
  }, [normalizedTrackers]);

  const totalTrackedWithoutVacations = useMemo(() => {
    let totalTime = 0;
    normalizedTrackers.forEach(({ total, trackersByProject }) => {
      trackersByProject.forEach(({ name }) => {
        if (breaksTitles.includes(name as string)) {
          totalTime += total;
        } else {
          return;
        }
      });
    });

    return totalTime;
  }, [normalizedTrackers]);

  const reportSidebarProps = {
    checked,
    setChecked,
    selectedDates,
    selectedEmployees,
    selectedProjects,
    setSelectedDates,
    setSelectedEmployees,
    setSelectedProjects,
  };

  return (
    <MainWrapper sidebar={<ReportPageSidebar {...reportSidebarProps} />}>
      <Typography variant="h1">{title}</Typography>
      <Stack mt={6} flexDirection="row" justifyContent="space-between">
        <Stack flexDirection="row" gap={2}>
          <Typography fontWeight="600">Period:</Typography>
          <Typography>
            {`${format(selectedDates[0], 'd MMM yyyy')}${
              selectedDates[1]
                ? ` - ${format(selectedDates[1], 'd MMM yyyy')}`
                : ''
            }`}
          </Typography>
        </Stack>
        <Stack flexDirection="row" gap={2}>
          <Typography fontWeight="600">Total tracked:</Typography>
          <Typography>
            {getHours(
              checked
                ? totalTracked
                : totalTracked - totalTrackedWithoutVacations
            )}
          </Typography>
        </Stack>
      </Stack>
      <Stack mt={6}>
        <ReportTable trackers={normalizedTrackers} isShowVacation={checked} />
      </Stack>
    </MainWrapper>
  );
};

export default ReportPage;
