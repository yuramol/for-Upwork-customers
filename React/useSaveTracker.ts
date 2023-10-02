import { useMutation } from '@apollo/client';

import {
  PROJECTS_QUERY,
  TRACKERS_QUERY,
  UPDATE_TRACKER_BY_ID_MUTATION,
} from 'api';
import {
  Enum_Tracker_Live_Status,
  MutationUpdateTrackerArgs,
  TrackerEntityResponse,
} from 'types/GraphqlTypes';

import { TimeEntryValues } from 'components/TrackerEntryModalForm';
import { TIME_ENTRY_FIELDS } from 'components/TrackerEntryModalForm/TrackerEntryForm';

const useSaveTracker = () => {
  const [save] = useMutation<TrackerEntityResponse, MutationUpdateTrackerArgs>(
    UPDATE_TRACKER_BY_ID_MUTATION
  );

  const saveTracker = (trackerId: string, values: TimeEntryValues) => {
    return save({
      variables: {
        id: trackerId,
        data: {
          live: false,
          live_status: Enum_Tracker_Live_Status.Finish,
          startLiveDate: null,
          liveDurationMinutes: null,
          date: values[TIME_ENTRY_FIELDS.DATE],
          durationMinutes: values[TIME_ENTRY_FIELDS.DURATION],
          description: values[TIME_ENTRY_FIELDS.DESCRIPTION],
        },
      },
      refetchQueries: [TRACKERS_QUERY, PROJECTS_QUERY],
    });
  };
  return { saveTracker };
};

export { useSaveTracker };
