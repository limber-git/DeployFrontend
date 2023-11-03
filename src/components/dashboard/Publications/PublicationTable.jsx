// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import {
  deleteStateAllPublications,
  deselectAllPublications,
  deselectPublication,
  getAllPublication,
  selectAllPublications,
  selectPublication,
} from "../../../redux-toolkit/actions/publicationActions";
import {
  Avatar,
  Button,
  Checkbox,
  Grid,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import ModalUpdatePublication from "./modalUpdatePublication";
import axios from "axios";

//Componente principal PublicationTable
export default function PublicationTable() {
  const dispatch = useDispatch(); //Obtiene la funcion dispatch de Redux para enviar acciones
  const data = useSelector((state) => state.publications.publications); //selectedPublications. Obtiene la lista de los usuarios del estado global de Redux
  const selectedPublications = useSelector(
    (state) => state.publications.selectedPublications
  ); //Obtiene la lista de los usuarios seleccionados del estado global de Redux
  const [selectAll, setSelectAll] = useState(false); //Estado local para el control de seleccion de todos los usuarios

  // //Modal para editar publicacion seleccionada
  const [open, setOpen] = useState(false);
  const [selectedPublicationModal, setSelectedPublicationModal] = useState("");

  //funciones para abrir y cerrar el modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Variables y funciones para controlar el modal de agregar una publicacion
  const [openAddPublication, setOpenAddPublication] = useState(false);

  const handleOpenAddPublication = () => setOpenAddPublication(true);
  const handleCloseAddPublication = () => setOpenAddPublication(false);

  //Funcion para seleccionar/deseleccionar las publicaciones
  const handleSelectAll = () => {
    if (!selectAll) {
      dispatch(selectAllPublications(data.map((pub) => pub.id_Publicacion))); //Activa la seleccion de todos las publicaciones
      setSelectAll(true); //Actualiza el estado local
    } else {
      dispatch(deselectAllPublications()); //Deselecciona todas las publicaciones
      setSelectAll(false); // Actualiza el estado local
    }
  };
  //Funcion para seleccionar la publicacion que se va a editar
  const handleModal = (id) => {
    setSelectedPublicationModal(id);
    handleOpen(true);
  };

  //funcion para eliminar publicaciones http://localhost:3001/api/publication/create
  const handleDelete = async () => {
    const response = await axios.post("publication/delete/select", {
      ids: selectedPublications,
    });
    setTimeout(() => {
      dispatch(getAllPublication()); //Actualiza la lista de publicaciones despues de la eliminacion
      dispatch(deselectAllPublications()); //Deselecciona a todos los usuarios.
      dispatch(deleteStateAllPublications()); //Elimina el estado de los usuarios seleccionados
      toast.success("Borrado exitoso!"); //Muestra una notificacion de exito
    }, 1500);
  };

  //funcion para seleccionar/deseleccionar una publicacion infividual
  const handleSelectPublication = (pubId) => {
    if (selectedPublications.includes(pubId)) {
      dispatch(deselectPublication(pubId)); //Deselecciona la publicacion
      setSelectAll(false); //actualiza el estado local
    } else {
      dispatch(selectPublication(pubId)); //Selecciona la publicacion
    }
  };
  //Efecto para cargar la lista de las publicaciones al cargar el componente
  useEffect(() => {
    dispatch(getAllPublication()); //Obtiene la lista de las publicaciones al montaar el componente
  }, [dispatch]);

  //Renderizado del componente
  return (
    <TableContainer
      sx={{ width: "100%", borderRadius: "0", height: "100vh%" }}
      component={Paper}
    >
      {/*rederiza el modal de modificacion*/}
      {open ? (
        <ModalUpdatePublication
          id={selectedPublicationModal}
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
        ></ModalUpdatePublication>
      ) : null}
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        style={{ padding: "10px", gap: "10px" }}
      >
        {/*Boton para eliminar publicaciones*/}
        <Button
          disabled={selectedPublications.length > 0 ? false : true}
          variant="contained"
          color="error"
          sx={{ borderRadius: "3px" }}
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
        >
          Borrar {selectedPublications.length}
        </Button>
        {/*Boton para agregar nueva publicacion*/}
        {/* <Button
          variant="contained"
          sx={{ borderRadius: "0px" }}
          startIcon={<AddIcon sx={{ color: 'white' }} />}
          onClick={handleOpenAddPublication}
        >
          Añadir
        </Button> */}
      </Grid>
      {/*Tabla de publicaciones*/}
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Checkbox
                color="primary"
                inputProps={{
                  "aria-label": "select all users",
                }}
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </TableCell>
            {/*Encabezado de las columnas*/}
            <TableCell align="center">Titulo</TableCell>
            <TableCell align="center">Descripcion</TableCell>
            <TableCell align="center">Estado</TableCell>
            <TableCell align="center">Imagenes</TableCell>
            <TableCell align="center">Opciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedPublications.includes(row.id_Publicacion)}
                  onChange={() => handleSelectPublication(row.id_Publicacion)}
                />
              </TableCell>
              <TableCell align="center">{row.titulo}</TableCell>
              <TableCell
                align="center"
                style={{
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.descripcion}
              </TableCell>
              <TableCell align="center">
                {row.estado ? "Visible" : "Oculto"}
              </TableCell>
              <TableCell align="center" sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }} >
                {
                  row.multimedia.map((im) => {
                    return (
                      <Avatar key={im} alt="Remy Sharp" src={im ? im : null} />
                    )
                  })
                }
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleModal(row.id_Publicacion)}
                  sx={{ borderRadius: "0px" }}
                  endIcon={<EditIcon></EditIcon>}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
