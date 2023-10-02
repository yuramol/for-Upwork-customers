import { useMutation } from '@apollo/client';
import { format, formatISO } from 'date-fns';

import {
  CREATE_TRACKER_BY_USER_ID_MUTATION,
  PROJECTS_QUERY,
  TRACKERS_QUERY,
} from 'api';
import { TimeEntryValues } from 'components/TrackerEntryModalForm';
import {
  Enum_Tracker_Live_Status,
  MutationCreateTrackerArgs,
  TrackerEntityResponse,
} from 'types/GraphqlTypes';

const useCreateTracker = () => {
  const [create] = useMutation<
    TrackerEntityResponse,
    MutationCreateTrackerArgs
  >(CREATE_TRACKER_BY_USER_ID_MUTATION);

  const createTracker = (userId: string, values: TimeEntryValues) =>
    create({
      variables: {
        data: {
          user: userId,
          date: format(new Date(), 'yyyy-MM-dd'),
          project: values.project,
          description: values.description,
          live: true,
          live_status: Enum_Tracker_Live_Status.Start,
          startLiveDate: formatISO(new Date()),
        },
      },
      refetchQueries: [TRACKERS_QUERY, PROJECTS_QUERY],
    });
  return { createTracker };
};

export { useCreateTracker };
