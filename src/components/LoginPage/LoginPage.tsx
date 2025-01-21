/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import * as classes from "./styles";

export default function LoginPage() {
  // @ts-ignore
  const handleSuccess = (data) => {
    console.log("Form submitted successfully:", data);
  };
  // @ts-ignore
  const handleError = (errors) => {
    console.error("Form submission errors:", errors);
  };

  return (
    <div>
      <Typography component="h1" css={classes.titleIndent} variant="h4">
        Login
      </Typography>
      <FormContainer
        defaultValues={{ name: "" }}
        onSuccess={handleSuccess}
        onError={handleError}
        mode="onBlur"
      >
        <Stack spacing={2}>
          <TextFieldElement
            name="name"
            label="Name"
            required
            rules={{
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            }}
          />
          <TextFieldElement
            name="password"
            label="Password"
            required
            type={"password"}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />
          <Button
            type={"submit"}
            variant="contained"
            color="secondary"
            fullWidth
          >
            Submit
          </Button>
        </Stack>
      </FormContainer>
    </div>
  );
}
