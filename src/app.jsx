import React from "react";
import { Container } from "@mui/material";
import FormSearch from "./components/form_search";
import ResultGrid from "./components/result_grid";
import mixpanel from 'mixpanel-browser';

mixpanel.init('654a44fc39f2a504fe467d0cf7ad5cab', {
  // debug: true, 
  // track_pageview: true, 
});

function App() {
  return (
    <Container disableGutters sx={{ p: 0, mt: 4 }}>
      <FormSearch />
      <ResultGrid />
    </Container>
  );
}

export default App;
