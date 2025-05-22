import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import RatingField from "./RatingField";
import { CreateReviewInput } from "../../__generated__/graphql";

interface ReviewFormProps {
  onSubmit: (data: CreateReviewInput) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReviewForm({ onSubmit, setIsOpen }: ReviewFormProps) {
  return (
    <Dialog open onClose={() => setIsOpen(false)} component="fieldset">
      <Box sx={{ padding: "30px 20px" }}>
        <DialogTitle component="legend" variant="h3" sx={{ p: 0 }}>
          Please write a review
        </DialogTitle>
        <FormContainer<CreateReviewInput>
          defaultValues={{ feedback: "", rating: 0 }}
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
      </Box>
    </Dialog>
  );
}
