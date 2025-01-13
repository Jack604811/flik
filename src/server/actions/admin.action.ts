"use server";
import { db } from "../db";
import bcrypt from "bcrypt";

export const getDashboardData = async () => {
    const userCount = await db.user.count();
    const workspaceCount = await db.workspace.count();
    // TODO: Active trials
    const activeTrials = 0;

    const recentWorkspaces = await db.workspace.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            owner: {
                select: {
                    name: true,
                    image: true,
                },
            },
            siteName: true,
            createdAt: true,
        },
    });

    const recentUsers = await db.user.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
    });
    
    return {
        userCount,
        workspaceCount,
        activeTrials,
        recentWorkspaces,
        recentUsers,
    };
}

export const getUsersSummary = async () => {
    const users = await db.user.findMany({
        select: {
            id: true,
            image: true,
            name: true,
            email: true,
            emailVerified: true,
            createdAt: true,
        },
    });

    return users;
}

export const getWorkspaceSummary = async () => {
    // Need to get all the workspaces and the count of team members
    // The function should return an array of workspaces {siteName, id, createdAt}, total team members, and the owner {name, image}
    const workspaces = await db.workspace.findMany({ 
        select: {
            id: true,
            siteName: true,
            owner: { select: { name: true, image: true} },
            createdAt: true,
            teamMembers: {
                select: {
                    userId: true
                },
            },
        },
    });

    return workspaces;
}