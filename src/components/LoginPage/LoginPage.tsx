import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import * as classes from "./styles";

export default function LoginPage() {
  return (
    <div>
      <Typography component="h1" css={classes.titleIndent} variant="h4">
        Login
      </Typography>
      <FormContainer
        defaultValues={{ name: "" }}
        onSuccess={(data) => console.log(data)}
      >
        <TextFieldElement
          css={classes.indent}
          name="name"
          label="Name"
          required
        />
        <TextFieldElement name="password" label="Password" required />
      </FormContainer>
      <Button
        css={classes.button}
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
      >
        Submit
      </Button>
    </div>
  );
}
