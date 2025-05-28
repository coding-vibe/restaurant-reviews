import { useFormContext, Controller } from "react-hook-form";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// import * as classes from "./styles";

interface Props {
  name: string;
  className?: string;
}

export default function RatingField({ name, className }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box className={className}>
      <Controller
        name={name}
        control={control}
        rules={{ required: "Rating is required" }}
        render={({ field: { value, ...field } }) => (
          <>
            <Rating value={Number(value)} {...field} />
            {errors[name] && (
              <Typography
                color="error"
                variant="caption"
                sx={{ display: "block" }}
              >
                {errors[name]?.message as string}
              </Typography>
            )}
          </>
        )}
      />
    </Box>
  );
}
