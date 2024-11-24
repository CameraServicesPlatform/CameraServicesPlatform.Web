import { Button, Input, Rate, message } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { createRating } from "../../../api/ratingApi";

const validationSchema = Yup.object({
  ratingValue: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5")
    .required("Rating is required"),
  reviewComment: Yup.string().required("Review comment is required"),
});

const CreateRatingForm = ({ productID, onClose }) => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  const initialValues = {
    ratingValue: 0,
    reviewComment: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const result = await createRating(
      productID,
      accountId,
      values.ratingValue,
      values.reviewComment
    );
    if (result && result.isSuccess) {
      message.success("Rating created successfully");
      onClose();
    } else {
      message.error("Failed to create rating");
      console.error(
        "Failed to create rating:",
        result ? result.messages : "Unknown error"
      );
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating Value:
            </label>
            <Field name="ratingValue">
              {({ field }) => (
                <Rate
                  {...field}
                  onChange={(value) => setFieldValue("ratingValue", value)}
                  className="mt-1"
                />
              )}
            </Field>
            <ErrorMessage
              name="ratingValue"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Review Comment:
            </label>
            <Field name="reviewComment">
              {({ field }) => (
                <Input.TextArea {...field} rows={4} className="mt-1" required />
              )}
            </Field>
            <ErrorMessage
              name="reviewComment"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            Submit Rating
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateRatingForm;
