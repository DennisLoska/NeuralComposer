import React from 'react';

/*
 * Renders the progress bar in the configuration tab of the SpecMenu component.
 * it receives the percentage from the callback of the action creator and the
 * axios progressEvent
 */
const Progress = ({ percentage }) => {
  return (
    <div className="ui green progress">
      <div
        className="progress-bar bar"
        role="progressbar"
        style={{ width: `${percentage}%` }}
      >
        <span className="ui progress">{percentage}%</span>
      </div>
    </div>
  );
};

export default Progress;
