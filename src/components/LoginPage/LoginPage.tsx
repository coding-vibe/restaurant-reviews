/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import {
  LoginUserDocument,
  LoginUserMutation,
  LoginUserMutationVariables,
  LoginUserInput,
} from "../../__generated__/graphql";
import Cookies from "js-cookie";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";

import { TokenNames } from "../../constants/tokens";
import * as classes from "./styles";

export default function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [login, { loading }] = useMutation<
    LoginUserMutation,
    LoginUserMutationVariables
  >(LoginUserDocument, {
    onCompleted: (data) => {
      Cookies.set(TokenNames.ACCESS_TOKEN, data.loginUser.accessToken, {
        expires: 15 / (24 * 60),
      });
      Cookies.set(TokenNames.REFRESH_TOKEN, data.loginUser.refreshToken, {
        expires: 8 / 24,
      });
      navigate("/restaurant/1/reviews");
    },
    onError: () => {
      enqueueSnackbar("Authorization failed", {
        variant: "error",
      });
    },
  });

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSuccess = async (data: LoginProps) => {
    login({
      variables: {
        input: {
          email: "Ignacio62@gmail.com",
          password: "Qwerty123!",
        },
      },
    });
  };

  return (
    <div>
      <Typography component="h1" css={classes.titleIndent} variant="h4">
        Login
      </Typography>
      <FormContainer<LoginUserInput>
        defaultValues={{ email: "" }}
        onSuccess={handleSuccess}
        mode="onBlur"
      >
        <Stack spacing={2}>
          <TextFieldElement
            name="email"
            label="Email"
            required
            rules={{
              required: "Email",
              minLength: {
                value: 3,
                message: "Email must be at least 3 characters",
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
          <LoadingButton
            fullWidth
            color="secondary"
            loading={loading}
            type={"submit"}
            variant="contained"
          >
            Submit
          </LoadingButton>
        </Stack>
      </FormContainer>
    </div>
  );
}
