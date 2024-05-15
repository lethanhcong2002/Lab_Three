import React, { useState } from 'react';
import { Button, IconButton, Menu, Portal, Dialog, Paragraph } from 'react-native-paper';
import { deleteServiceData, restoreServiceData } from '../store';

export default function DotMenu({ navigation, serviceData }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);

    function updateService() {
        closeMenu();
        navigation.navigate("UpdateService", { serviceData: serviceData });
    }

    function deleteService() {
        closeMenu();
        showDialog();
    }

    function restoreService() {
        closeMenu();
        restoreServiceData(serviceData.id);
        navigation.goBack();
    }

    function handleDeleteService() {
        deleteServiceData(serviceData.id);
        hideDialog();
        navigation.goBack();
    }
    return (
        <>
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}>
                <Menu.Item
                    title="Cập nhật thông tin"
                    onPress={updateService}
                />
                <Menu.Item
                    title="Xóa"
                    onPress={deleteService}
                />
                <Menu.Item
                    title="Khôi phục"
                    onPress={restoreService}
                />
            </Menu>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>Xác nhận xóa</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Bạn có chắc muốn xóa dịch vụ này?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Hủy</Button>
                        <Button onPress={handleDeleteService}>Xóa</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}
