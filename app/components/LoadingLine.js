import React from 'react';

import { LinearProgress } from '@material-ui/core';
import { CoreProvider } from './../core/Core';

import "./LoadingLine.sass";

export default function LoadingLine() {
  const app = React.useContext(CoreProvider);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let timeout = null;
    if (loading) {
      timeout = setTimeout(() => setLoading(false), 1200);
    }
    let clb = app.store.subscribe(() => {
      let update = true;
      if (!update) return;

      if (timeout != null) {
        clearTimeout(timeout);
        timeout = setTimeout(() => setLoading(false), 1200);
      } else {
        setLoading(true);
      }
    });
    return () => {
      clb();
      if (timeout != null)
        clearTimeout(timeout);
    }
  });

  return (
    <div className={"loading-line " + (loading ? 'visible' : 'non-visible') }>
      <LinearProgress key="123" />
    </div>
  );
}