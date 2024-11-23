import React from 'react';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import img12 from '../../../../public/introduce/12.png';
import img31 from '../../../../public/introduce/31.png';
import img3 from '../../../../public/introduce/3.png';
import img4 from '../../../../public/introduce/4.png';
import img5 from '../../../../public/introduce/5.png';

const StyledImg = styled('img')({});

const Content = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: "140px" }}>

      <Box>
        <Typography
          align="center"
          variant="h2"
          sx={{ fontWeight: "400", p: 4, color: "secondary.main" }}
        >
          Where work connects
        </Typography>

        <Typography
          align="center"
          variant="h5"
          sx={{ mb: 6, color: "secondary.main" }}
        >
          Get everyone working in a single platform designed to manage any type of work.
        </Typography>

        <Box align="center" sx={{ mb: 3 }}
        >
          <Button sx={{ pt: 2, pb: 2, pr: 3, pl: 3, fontSize: 19, borderRadius: 20, mr: 2 }} variant="contained">Get started</Button>
          <Button sx={{ pt: 2, pb: 2, pr: 3, pl: 3, fontSize: 19, borderRadius: 20 }} variant="outlined">View demo</Button>
        </Box>
      </Box>

      <Box align="center" sx={{ mb: 3, mt: "170px" }}
      >
        <Typography
          align="center"
          variant="h6"
          sx={{ mb: 3, color: "secondary.main" }}
        >
          Trusted by 2 million+ teams
        </Typography>
        <StyledImg sx={{ height: 65, mr: 2 }} src={img12} alt="monday.com" />
        <StyledImg sx={{ height: 70, mr: 2 }} src={img31} alt="monday.com" />
        <StyledImg sx={{ height: 70, mr: 2 }} src={img3} alt="monday.com" />
        <StyledImg sx={{ height: 70, mr: 2 }} src={img4} alt="monday.com" />
        <StyledImg sx={{ height: 60, mr: 2 }} src={img5} alt="monday.com" />
      </Box>

      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5">Section 1</Typography>
            <Typography variant="body1">
              This is the content for Section 1.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5">Section 2</Typography>
            <Typography variant="body1">
              This is the content for Section 2.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="body1">
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB
        [nodemon] watching extensions: js,mjs,cjs,json
        [nodemon] starting `babel-node ./src/server.js`
        (node:25792) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version(Use `node --trace-warnings ...` to show where the warning was created)
        (node:25792) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
        Server is running on the port 5000
        Connected to MongoDB

      </Typography> */}
    </Container>
  );
};

export default Content;