import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { getAccountById, updateAccount } from "../../../api/accountApi";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { login } from "../../../redux/features/authSlice";

const validationSchema = Yup.object({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  firstName: Yup.string().required("Họ là bắt buộc"),
  lastName: Yup.string().required("Tên là bắt buộc"),
  phoneNumber: Yup.string().required("Số điện thoại là bắt buộc"),
  address: Yup.string().required("Địa chỉ là bắt buộc"),
});

const PersonalModal = ({ onClose }) => {
  const { user } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl">
        <h3 className="font-bold text-lg mb-4">Thông tin cá nhân</h3>
        <Formik
          initialValues={{
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
              const data = await updateAccount(values);
              if (data.isSuccess) {
                const userData = await getAccountById(user.id);
                console.log(userData);
                if (userData.isSuccess) {
                  dispatch(login(userData.result?.account));
                  toast.success("Cập nhật dữ liệu thành công");
                }
              } else {
                if (data.messages.length === 0) {
                  toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
                } else {
                  data.messages.forEach((item) => {
                    toast.error(item);
                  });
                }
              }
            } catch (error) {
              toast.error("Có lỗi xảy ra, vui lòng thử lại");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="label font-semibold">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  readOnly
                  className={`input input-bordered w-full`}
                  placeholder="Nhập email của bạn"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="label font-semibold">
                    Họ
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`input input-bordered w-full`}
                    placeholder="Nhập họ của bạn"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-error mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="label font-semibold">
                    Tên
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`input input-bordered w-full`}
                    placeholder="Nhập tên của bạn"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-error mt-1"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="label font-semibold">
                  Số điện thoại
                </label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  className={`input input-bordered w-full`}
                  placeholder="Nhập số điện thoại của bạn"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              <div>
                <label htmlFor="address" className="label font-semibold">
                  Địa chỉ
                </label>
                <Field
                  id="address"
                  name="address"
                  type="text"
                  className={`input input-bordered w-full`}
                  placeholder="Nhập địa chỉ của bạn"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn bg-primary text-white"
                  disabled={isSubmitting}
                >
                  Gửi
                </button>
                <button className="btn btn-ghost" onClick={onClose}>
                  Đóng
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalModal;
