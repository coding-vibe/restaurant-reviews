import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation } from "@apollo/client";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
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
  FindAllRestaurantReviewsDocument,
  FindAllRestaurantReviewsQuery,
  FindAllRestaurantReviewsQueryVariables,
} from "../../__generated__/graphql";
import ReviewForm from "../ReviewForm";

export default function ReviewsPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  });

  const handleSubmit = (data: CreateReviewInput) => {
    createReview({
      variables: {
        createReviewInput: {
          restaurantId: Number(id),
          rating: Number(data.rating),
          feedback: data.feedback,
        },
      },
    });
  };

  if (loading) return <CircularProgress color="secondary" />;
  if (error) return <Alert severity="error">Fetching data failed</Alert>;

  return (
    <TableContainer component={Paper}>
      <Typography component="h1" variant="h2">
        Restaurant Reviews
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsOpen(true)}
      >
        Add review
      </Button>
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
            data.findAllRestaurantReviews.edges.map(({ node }) => (
              <TableRow key={node.id}>
                <TableCell>{node.author.id}</TableCell>
                <TableCell>{node.author.firstName}</TableCell>
                <TableCell>{node.author.lastName}</TableCell>
                <TableCell>{node.rating}</TableCell>
                <TableCell>{node.feedback}</TableCell>
                <TableCell>
                  {new Date(parseInt(node.createdAt)).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {isOpen && <ReviewForm setIsOpen={setIsOpen} onSubmit={handleSubmit} />}
    </TableContainer>
  );
}
