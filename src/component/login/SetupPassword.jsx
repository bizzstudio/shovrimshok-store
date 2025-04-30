// src/component/login/SetupPassword.jsx
import { FiLock } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

// Internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import notifyApiResponse from "@utils/notifyApiResponse";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import { UserContext } from "@context/UserContext";
import MainBT from "@component/button/MainBT";

const SetupPassword = ({ userInfo, setModalOpen }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    const { dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [notMatch, setNotMatch] = useState({ message: '' });
    const { t } = useTranslation();

    const comparePasswords = (value) => {
        if (value !== watch("newPassword")) {
            setNotMatch({ message: t('common:passwordsDoNotMatch') });
        } else {
            setNotMatch('');
        }
    };

    const onSubmit = ({ newPassword, confirmPassword }) => {
        if (newPassword !== confirmPassword) {
            setNotMatch({ message: t('common:passwordsDoNotMatch') });
            return;
        }

        setLoading(true);
        CustomerServices.changePassword({
            email: userInfo?.E_Mail,
            currentPassword: userInfo?.LicTradNum,
            newPassword
        })
            .then((res) => {
                notifyApiResponse(res, true);

                // Update userInfo in context and cookies
                const updatedUserInfo = {
                    ...userInfo,
                    isWithoutPassword: false
                };

                dispatch({ type: 'USER_LOGIN', payload: updatedUserInfo });
                Cookies.set('userInfo', JSON.stringify(updatedUserInfo));

                setLoading(false);
                setModalOpen(false);
                reset();
            })
            .catch((err) => {
                setLoading(false);
                notifyApiResponse(err, false);
            });
    };

    return (
        <>
            <div className="text-center mb-4">
                <ShapiraTitle text={t("common:setupPassword")} height={50} key="setupPassword" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-3">
                <p className="text-center">{t("common:newUserPasswordSetup")}</p>

                <div className="">
                    <InputArea
                        register={register}
                        name="newPassword"
                        type="password"
                        placeholder={t("common:password")}
                        Icon={FiLock}
                    />
                    <Error errorName={errors.newPassword} />
                </div>

                <div className="mb-1">
                    <InputArea
                        register={register}
                        name="confirmPassword"
                        type="password"
                        placeholder={t('common:confirmPassword')}
                        Icon={FiLock}
                        onChange={(e) => comparePasswords(e.target.value)}
                    />
                    <Error errorName={notMatch} />
                </div>

                {loading ? (
                    <MainBT
                        disabled={true}
                        type="submit"
                    >
                        <img src="/loader/spinner.gif" className="saturate-0" alt="Loading" width={20} height={10} />
                        <span className="ms-1">{t("common:processing")}</span>
                    </MainBT>
                ) : (
                    <MainBT
                        disabled={loading}
                        type="submit"
                    >
                        {t("common:savePassword")}
                    </MainBT>
                )}
            </form>
        </>
    );
};

export default SetupPassword;