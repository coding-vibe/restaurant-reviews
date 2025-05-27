import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RatingField from "./RatingField";
import { CreateReviewInput } from "../../__generated__/graphql";

interface Review {
  id: number;
  rating: number;
  feedback: string;
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface ReviewFormProps {
  onSubmit: (data: CreateReviewInput) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues?: Pick<Review, "rating" | "feedback">;
}

export default function ReviewForm({
  onSubmit,
  initialValues,
}: ReviewFormProps) {
  return (
    <FormContainer<CreateReviewInput>
      defaultValues={initialValues || { feedback: "", rating: 0 }}
      onSuccess={onSubmit}
      mode="onBlur"
    >
      <Stack spacing={2}>
        <RatingField name="rating" />
        <TextFieldElement
          name="feedback"
          label="Feedback"
          required
          multiline
          rows={4}
          rules={{
            required: "Feedback is required",
            minLength: {
              value: 10,
              message: "Feedback must be at least 10 characters long",
            },
            maxLength: {
              value: 200,
              message: "Feedback must not exceed 200 characters",
            },
          }}
        />
        <Button
          fullWidth
          color="secondary"
          // loading={loading}
          type="submit"
          variant="contained"
        >
          Submit
        </Button>
      </Stack>
    </FormContainer>
  );
}
