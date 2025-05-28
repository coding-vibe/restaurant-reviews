import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation } from "@apollo/client";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";

import {
  CreateReviewDocument,
  CreateReviewMutation,
  CreateReviewMutationVariables,
  CreateReviewInput,
  MutationDeleteReviewArgs,
  FindAllRestaurantReviewsDocument,
  FindAllRestaurantReviewsQuery,
  FindAllRestaurantReviewsQueryVariables,
  EditReviewInput,
  EditReviewDocument,
  EditReviewMutation,
  EditReviewMutationVariables,
  DeleteReviewDocument,
  DeleteReviewMutation,
  DeleteReviewMutationVariables,
} from "../../__generated__/graphql";
import ReviewForm from "../ReviewForm";

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

export default function ReviewsPage() {
  const [isOpenCreateReview, setIsOpenCreateReview] = useState<boolean>(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading, error } = useQuery<
    FindAllRestaurantReviewsQuery,
    FindAllRestaurantReviewsQueryVariables
  >(FindAllRestaurantReviewsDocument, {
    variables: {
      restaurantName: "Tres French",
      input: { limit: 25 },
    },
  });

  const [createReview] = useMutation<
    CreateReviewMutation,
    CreateReviewMutationVariables
  >(CreateReviewDocument, {
    onCompleted: (data) => {
      console.log(data);
      enqueueSnackbar("Review created successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Creating review failed", {
        variant: "error",
      });
    },
    refetchQueries: [
      FindAllRestaurantReviewsDocument,
      "findAllRestaurantReviews",
    ],
  });

  const handleCreateReview = (data: CreateReviewInput) => {
    createReview({
      variables: {
        createReviewInput: {
          restaurantId: Number(id),
          rating: Number(data.rating),
          feedback: data.feedback,
        },
      },
    });
    setIsOpenCreateReview(false);
  };

  const [deleteReview] = useMutation<
    DeleteReviewMutation,
    DeleteReviewMutationVariables
  >(DeleteReviewDocument, {
    onCompleted: (data) => {
      console.log(data);
      enqueueSnackbar("Review deleted successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Deleting review failed", {
        variant: "error",
      });
    },
    refetchQueries: [
      FindAllRestaurantReviewsDocument,
      "findAllRestaurantReviews",
    ],
  });

  const handleDeleteReview = (data: MutationDeleteReviewArgs) => {
    deleteReview({
      variables: {
        deleteReviewId: data.id,
      },
    });
  };

  const [editReview] = useMutation<
    EditReviewMutation,
    EditReviewMutationVariables
  >(EditReviewDocument, {
    onCompleted: (data) => {
      console.log(data);
      enqueueSnackbar("Review edited successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Editing review failed", {
        variant: "error",
      });
    },
  });

  const handleEditReview = (data: EditReviewInput) => {
    if (!reviewToEdit) return;
    editReview({
      variables: {
        reviewId: reviewToEdit.id.toString(),
        body: {
          rating: Number(data.rating),
          feedback: data.feedback,
        },
      },
    });
    setReviewToEdit(null);
  };

  if (loading) return <CircularProgress color="secondary" />;
  if (error) return <Alert severity="error">Fetching data failed</Alert>;

  return (
    <TableContainer component={Paper}>
      <Box display="flex" justifyContent="space-around">
        <Typography component="h1" variant="h2">
          Restaurant Reviews
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setIsOpenCreateReview(true)}
        >
          Add review
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Author ID</TableCell>
            <TableCell>Author First Name</TableCell>
            <TableCell>Author Last Name</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Feedback</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.findAllRestaurantReviews.edges &&
            data.findAllRestaurantReviews.edges.map(({ node: review }) => (
              <TableRow key={review.id}>
                <TableCell>{review.author.id}</TableCell>
                <TableCell>{review.author.firstName}</TableCell>
                <TableCell>{review.author.lastName}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.feedback}</TableCell>
                <TableCell>
                  {new Date(parseInt(review.createdAt)).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setReviewToEdit(review)}
                  >
                    Edit review
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      handleDeleteReview({ id: review.id.toString() })
                    }
                  >
                    Delete review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Dialog
        open={isOpenCreateReview}
        onClose={() => setIsOpenCreateReview(false)}
        component="fieldset"
      >
        <Box sx={{ padding: "30px 20px" }}>
          <DialogTitle component="legend" variant="h4" sx={{ p: 0 }}>
            Please create a review
          </DialogTitle>
          <ReviewForm
            setIsOpen={setIsOpenCreateReview}
            onSubmit={handleCreateReview}
          />
        </Box>
      </Dialog>
      <Dialog
        open={!!reviewToEdit}
        onClose={() => setReviewToEdit(null)}
        component="fieldset"
      >
        <Box sx={{ padding: "30px 20px" }}>
          <DialogTitle component="legend" variant="h4" sx={{ p: 0 }}>
            Please edit a review
          </DialogTitle>
          <ReviewForm
            initialValues={
              reviewToEdit ? reviewToEdit : { feedback: "", rating: 0 }
            }
            setIsOpen={() => setReviewToEdit(null)}
            onSubmit={handleEditReview}
          />
        </Box>
      </Dialog>
    </TableContainer>
  );
}
