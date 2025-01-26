import { useNavigate, generatePath } from "react-router";
import { useMutation } from "@apollo/client";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useSnackbar } from "notistack";

import { TokenNames } from "../../constants/tokens";
import setToken from "../../utils/setToken";
import {
  LoginUserDocument,
  LoginUserMutation,
  LoginUserMutationVariables,
  LoginUserInput,
} from "../../__generated__/graphql";

export default function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const reviewsPage = generatePath("/restaurant/:id/reviews", {
    id: "1",
  });

  const [login, { loading }] = useMutation<
    LoginUserMutation,
    LoginUserMutationVariables
  >(LoginUserDocument, {
    onCompleted: (data) => {
      setToken(
        TokenNames.ACCESS_TOKEN,
        data.loginUser.accessToken,
        15 / (24 * 60)
      );
      setToken(TokenNames.REFRESH_TOKEN, data.loginUser.refreshToken, 8 / 24);
      navigate(reviewsPage);
    },
    onError: () => {
      enqueueSnackbar("Authorization failed", {
        variant: "error",
      });
    },
  });

  const handleSubmit = (data: LoginUserInput) => {
    login({
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    });
  };

  return (
    <Paper component="fieldset">
      <Typography component="legend" variant="h2">
        Please enter your login details
      </Typography>
      <FormContainer<LoginUserInput>
        defaultValues={{ email: "" }}
        onSuccess={handleSubmit}
        mode="onBlur"
      >
        <Stack spacing={2}>
          <TextFieldElement
            name="email"
            label="Email"
            required
            rules={{
              required: "Email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
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
            fullWidth
            color="secondary"
            loading={loading}
            type={"submit"}
            variant="contained"
          >
            Submit
          </Button>
        </Stack>
      </FormContainer>
    </Paper>
  );
}
